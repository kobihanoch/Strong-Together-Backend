import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { bootstrapRequest, type BootstrapRequestQuery, type BootstrapResponse } from '@strong-together/shared';
import { CurrentLogger } from '../../common/decorators/current-logger.decorator.ts';
import { CurrentUser } from '../../common/decorators/current-user.decorator.ts';
import { RequestData } from '../../common/decorators/request-data.decorator.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe.ts';
import type { AppLogger } from '../../infrastructure/logger.ts';
import { AuthenticatedUser } from '../../shared/types/express.js';
import { BootstrapService } from './bootstrap.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';

/**
 * Bootstrap routes for authenticated users.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - GET /api/bootstrap/get
 *
 * Access: User
 */
@Controller('api/bootstrap')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class BootstrapController {
  constructor(private readonly bootstrapService: BootstrapService) {}

  /**
   * Get the authenticated user's bootstrap payload.
   *
   * Aggregates the initial application payload, including user profile, workout
   * plan, tracking history, inbox data, and aerobics history for the requested
   * timezone.
   *
   * Route: GET /api/bootstrap/get
   * Access: User
   */
  @Get('get')
  async getBootstrapData(
    @RequestData(new ValidateRequestPipe(bootstrapRequest)) data: { query: BootstrapRequestQuery },
    @CurrentUser() user: AuthenticatedUser,
    @CurrentLogger() requestLogger: AppLogger,
  ): Promise<BootstrapResponse> {
    const tz = data.query.tz || 'Asia/Jerusalem';
    const payload = await this.bootstrapService.getBootstrapDataPayload(user.id, tz, requestLogger);
    return payload satisfies BootstrapResponse;
  }
}
