import { Controller, Put, UseGuards } from '@nestjs/common';
import type { ReplacePushTokenBody } from '@strong-together/shared';
import { replacePushTokenRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { ReplacePushTokenUseCase } from '../application/commands/replace-push-token.use-case';

/** E */
@Controller('api/users')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class PushTokensController {
  constructor(private readonly replaceToken: ReplacePushTokenUseCase) {}
  /**
   * Replaces the authenticated user's push-notification token.
   *
   * API: `PUT /api/users/me/push-token`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - Validated push-token data.
   * @param user - The authenticated request user.
   * @returns No response body.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Put('me/push-token')
  async replace(
    @RequestData(new ValidateRequestPipe(replacePushTokenRequestSchema)) data: { body: ReplacePushTokenBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.replaceToken.execute(user.id, data.body.token);
  }
}
