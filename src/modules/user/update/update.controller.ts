import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import type {
  DeleteUserProfilePicBody,
  GetAuthenticatedUserByIdResponse,
  SetProfilePicAndUpdateDBResponse,
  UpdateAuthenticatedUserResponse,
  UpdateUserBody,
} from '@strong-together/shared';
import { deleteProfilePicRequest, updateUserRequest } from '@strong-together/shared';
import { CurrentLogger } from '../../../common/decorators/current-logger.decorator.ts';
import { CurrentRequestId } from '../../../common/decorators/current-request-id.decorator.ts';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.ts';
import { RequestData } from '../../../common/decorators/request-data.decorator.ts';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard.ts';
import {
  RateLimit,
  RateLimitGuard,
  updateUserRateLimit,
  updateUserRateLimitDaily,
} from '../../../common/guards/rate-limit.guard.ts';
import { imageUploadOptions } from '../../../common/interceptors/image-upload.config.ts';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe.ts';
import type { AppLogger } from '../../../infrastructure/logger.ts';
import type { AuthenticatedUser } from '../../../shared/types/express.js';
import { UpdateUserService } from './update.service.ts';
import { NotFound } from '@aws-sdk/client-s3';

/**
 * User profile-management routes.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/users/get
 * - PUT /api/users/updateself
 * - GET /api/users/changeemail
 * - DELETE /api/users/deleteself
 * - PUT /api/users/setprofilepic
 * - DELETE /api/users/deleteprofilepic
 *
 * Access: Mixed by route
 */
@Controller('api/users')
@UseInterceptors(RlsTxInterceptor)
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  /**
   * Get the authenticated user's profile.
   *
   * Returns the current user's persisted profile payload.
   *
   * Route: GET /api/users/get
   * Access: User
   */
  @Get('get')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async getAuthenticatedUserById(@CurrentUser() user: AuthenticatedUser): Promise<GetAuthenticatedUserByIdResponse> {
    const { payload } = await this.updateUserService.getUserData(user.id);
    return payload;
  }

  /**
   * Update the authenticated user's profile details.
   *
   * Persists allowed profile fields and sends an email-verification flow when
   * the submitted email differs from the current one.
   *
   * Route: PUT /api/users/updateself
   * Access: User
   */
  @Put('updateself')
  @UseGuards(RateLimitGuard, DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @RateLimit(updateUserRateLimitDaily, updateUserRateLimit)
  @Roles('user')
  async updateAuthenticatedUser(
    @RequestData(new ValidateRequestPipe(updateUserRequest))
    data: { body: UpdateUserBody },
    @CurrentUser() user: AuthenticatedUser,
    @CurrentRequestId() requestId: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UpdateAuthenticatedUserResponse> {
    const payload = await this.updateUserService.updateAuthenticatedUserData(user.id, data.body, requestId);

    if (payload.message === 'User not found') {
      throw new NotFoundException('User not found');
    }

    return payload;
  }

  /**
   * Confirm a pending email change from a signed email link.
   *
   * Validates the signed change-email token, enforces one-time use, updates the
   * email address, and returns an HTML result page.
   *
   * Route: GET /api/users/changeemail
   * Access: Public
   */
  @Get('changeemail')
  async updateSelfEmail(
    @Query('token') token: string | undefined,
    @CurrentLogger() requestLogger: AppLogger,
    @Res() res: Response,
  ): Promise<void> {
    const { statusCode, html } = await this.updateUserService.updateSelfEmailData(token, requestLogger);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(statusCode).type('html').set('Cache-Control', 'no-store').send(html);
  }

  /**
   * Delete the authenticated user's account.
   *
   * Removes the current user's account and returns a success message.
   *
   * Route: DELETE /api/users/deleteself
   * Access: User
   */
  @Delete('deleteself')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async deleteSelfUser(@CurrentUser() user: AuthenticatedUser): Promise<{ message: string }> {
    await this.updateUserService.deleteSelfUserData(user.id);
    return { message: 'User deleted successfully' };
  }

  /**
   * Upload a new profile image for the authenticated user.
   *
   * Stores the uploaded image in Supabase Storage, updates the user's profile
   * image path, and schedules cleanup of the previous image when applicable.
   *
   * Route: PUT /api/users/setprofilepic
   * Access: User
   */
  @Put('setprofilepic')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  @Roles('user')
  async setProfilePicAndUpdateDB(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentLogger() requestLogger: AppLogger,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SetProfilePicAndUpdateDBResponse> {
    const payload = await this.updateUserService.setProfilePicAndUpdateDBData(user.id, file, requestLogger);
    res.status(201);
    return payload;
  }

  /**
   * Delete the authenticated user's profile image.
   *
   * Removes the stored image from object storage and clears the profile image
   * reference from the user's record.
   *
   * Route: DELETE /api/users/deleteprofilepic
   * Access: User
   */
  @Delete('deleteprofilepic')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async deleteUserProfilePic(
    @RequestData(new ValidateRequestPipe(deleteProfilePicRequest))
    data: { body: DeleteUserProfilePicBody },
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ): Promise<void> {
    return this.updateUserService.deleteUserProfilePicData(user.id, data.body);
  }
}
