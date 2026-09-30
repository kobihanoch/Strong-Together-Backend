import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { ConfirmEmailChangeQuery, DeleteProfilePictureBody, GetCurrentUserResponse, ReplaceProfilePictureResponse, UpdateCurrentUserBody } from '@strong-together/shared';
import { confirmEmailChangeRequestSchema, deleteProfilePictureRequestSchema, updateCurrentUserRequestSchema } from '@strong-together/shared';
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
import { ConfirmEmailChangeCommand } from '../application/commands/confirm-email-change/confirm-email-change.command';
import { DeleteProfilePictureCommand } from '../application/commands/delete-profile-picture/delete-profile-picture.command';
import { DeleteUserCommand } from '../application/commands/delete-user/delete-user.command';
import { GetCurrentUserQuery } from '../application/queries/get-current-user/get-current-user.query';
import { ReplaceProfilePictureCommand } from '../application/commands/replace-profile-picture/replace-profile-picture.command';
import { UpdateCurrentUserCommand } from '../application/commands/update-current-user/update-current-user.command';
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
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
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
    return this.queryBus.execute(new GetCurrentUserQuery(user.id));
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
    await this.commandBus.execute(new UpdateCurrentUserCommand(user.id, data.body, requestId));
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
  async updateSelfEmail(
    @RequestData(new ValidateRequestPipe(confirmEmailChangeRequestSchema)) data: { query: ConfirmEmailChangeQuery },
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.commandBus.execute(new ConfirmEmailChangeCommand(data.query.token));
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
    await this.commandBus.execute(new DeleteUserCommand(user.id));
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
    const result = await this.commandBus.execute(new ReplaceProfilePictureCommand(user.id, file));
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
    await this.commandBus.execute(new DeleteProfilePictureCommand(user.id, data.body.profilePicPath));
  }
}
