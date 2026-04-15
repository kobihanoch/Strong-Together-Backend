import { Controller, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import type { SaveUserPushTokenBody } from '@strong-together/shared';
import { saveUserPushTokenRequest } from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.ts';
import { RequestData } from '../../../common/decorators/request-data.decorator.ts';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe.ts';
import type { AuthenticatedUser } from '../../../shared/types/express.js';
import { PushTokensService } from './push-tokens.service.ts';

/**
 * User push-token routes.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - PUT /api/users/pushtoken
 *
 * Access: User
 */
@Controller('api/users')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class PushTokensController {
  constructor(private readonly pushTokensService: PushTokensService) {}

  /**
   * Save or update the authenticated user's push notification token.
   *
   * Persists the submitted device push token for future notification delivery.
   *
   * Route: PUT /api/users/pushtoken
   * Access: User
   */
  @Put('pushtoken')
  async saveUserPushToken(
    @RequestData(new ValidateRequestPipe(saveUserPushTokenRequest))
    data: { body: SaveUserPushTokenBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.pushTokensService.saveUserPushTokenData(user.id, data.body);
  }
}
