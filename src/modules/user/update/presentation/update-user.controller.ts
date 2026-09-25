import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { DeleteProfilePictureBody, GetCurrentUserResponse, ReplaceProfilePictureResponse, UpdateCurrentUserBody } from '@strong-together/shared';
import { deleteProfilePictureRequestSchema, updateCurrentUserRequestSchema } from '@strong-together/shared';
import type { Response } from 'express';
import { CurrentRequestId } from '../../../../common/decorators/current-request-id.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { RateLimit, RateLimitGuard, updateUserRateLimit, updateUserRateLimitDaily } from '../../../../common/guards/rate-limit.guard';
import { imageUploadOptions } from '../../../../common/interceptors/image-upload.config';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import type { EmailChangeOutcome } from '../application/models/update-user.models';
import { ConfirmEmailChangeUseCase } from '../application/commands/confirm-email-change.use-case';
import { DeleteProfilePictureUseCase } from '../application/commands/delete-profile-picture.use-case';
import { DeleteUserUseCase } from '../application/commands/delete-user.use-case';
import { GetCurrentUserUseCase } from '../application/queries/get-current-user.use-case';
import { ReplaceProfilePictureUseCase } from '../application/commands/replace-profile-picture.use-case';
import { UpdateCurrentUserUseCase } from '../application/commands/update-current-user.use-case';
import { generateEmailChangeFailedHTML, generateEmailChangeSuccessHTML } from './update-user.views';

const emailChangeStatus: Record<EmailChangeOutcome['kind'], HttpStatus> = {
  confirmed: HttpStatus.OK,
  'missing-token': HttpStatus.UNAUTHORIZED,
  'invalid-token': HttpStatus.UNAUTHORIZED,
  'malformed-token': HttpStatus.BAD_REQUEST,
  'token-already-used': HttpStatus.UNAUTHORIZED,
  'email-in-use': HttpStatus.CONFLICT,
  failed: HttpStatus.INTERNAL_SERVER_ERROR,
};

/** E */
@Controller('api/users')
export class UpdateUserController {
  constructor(
    private readonly getUser: GetCurrentUserUseCase,
    private readonly updateUser: UpdateCurrentUserUseCase,
    private readonly confirmEmail: ConfirmEmailChangeUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly replacePicture: ReplaceProfilePictureUseCase,
    private readonly deletePicture: DeleteProfilePictureUseCase,
  ) {}

  /**
   * Retrieves the authenticated user's profile.
   *
   * API: `GET /api/users/me`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param user - The authenticated request user.
   * @returns The current profile.
   * @throws {UserNotFoundError} When the user is absent.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('me')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser): Promise<GetCurrentUserResponse> {
    return this.getUser.execute(user.id);
  }

  /**
   * Updates the authenticated user's profile.
   *
   * API: `PATCH /api/users/me`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`; `409 Conflict`; `429 Too Many Requests`.
   *
   * @param data - Validated profile changes.
   * @param user - The authenticated request user.
   * @param requestId - Optional request correlation identifier.
   * @returns No response body.
   * @throws {UserNotFoundError} When the user is absent.
   * @throws {UserConflictError} When a username or email is already used.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   * @throws {HttpException} When the rate limit is exceeded.
   */
  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RateLimitGuard, DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @RateLimit(updateUserRateLimitDaily, updateUserRateLimit)
  @Roles('user')
  async updateCurrentUser(
    @RequestData(new ValidateRequestPipe(updateCurrentUserRequestSchema)) data: { body: UpdateCurrentUserBody },
    @CurrentUser() user: AuthenticatedUser,
    @CurrentRequestId() requestId?: string,
  ): Promise<void> {
    await this.updateUser.execute(user.id, data.body, requestId);
  }

  /**
   * Confirms a pending email-address change.
   *
   * API: `GET /api/users/email-change`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `409 Conflict`; `500 Internal Server Error`.
   *
   * @param token - The signed email-change token.
   * @param res - The response used to render the result page.
   * @returns No response body from Nest; the response is sent directly.
   */
  @Get('email-change')
  async updateSelfEmail(@Query('token') token: string | undefined, @Res() res: Response): Promise<void> {
    const result = await this.confirmEmail.execute(token);
    const html = result.kind === 'confirmed' ? generateEmailChangeSuccessHTML() : generateEmailChangeFailedHTML(result.reason);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(emailChangeStatus[result.kind]).type('html').set('Cache-Control', 'no-store').send(html);
  }

  /**
   * Deletes the authenticated user's account.
   *
   * API: `DELETE /api/users/me`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param user - The authenticated request user.
   * @returns No response body.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async deleteSelfUser(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.deleteUser.execute(user.id);
  }

  /**
   * Replaces the authenticated user's profile picture.
   *
   * API: `PUT /api/users/me/profile-picture`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param user - The authenticated request user.
   * @param file - The uploaded image file.
   * @param res - The response used to set the created status.
   * @returns The stored picture path and public URL.
   * @throws {ProfilePictureRequiredError} When no image is supplied.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Put('me/profile-picture')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  @Roles('user')
  async replaceProfilePicture(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ReplaceProfilePictureResponse> {
    const result = await this.replacePicture.execute(user.id, file);
    res.status(201);
    return result;
  }

  /**
   * Deletes the authenticated user's profile picture.
   *
   * API: `DELETE /api/users/me/profile-picture`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated stored-object path.
   * @param user - The authenticated request user.
   * @returns No response body.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete('me/profile-picture')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async deleteProfilePicture(
    @RequestData(new ValidateRequestPipe(deleteProfilePictureRequestSchema)) data: { body: DeleteProfilePictureBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deletePicture.execute(user.id, data.body.profilePicPath);
  }
}
