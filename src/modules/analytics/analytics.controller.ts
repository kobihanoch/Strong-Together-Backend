import { Controller, Get, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type { GetAnalyticsResponse } from '@strong-together/shared';
import type { AuthenticatedUser } from '../../common/types/express.ts';
import { createLogger } from '../../infrastructure/logger.ts';
import { AnalyticsService } from './analytics.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard.ts';
import { CurrentUser } from '../../common/decorators/current-user.decorator.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';

/**
 * Analytics routes for authenticated users.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - GET /api/analytics/get
 *
 * Access: User
 */
@Controller('api/analytics')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
@UseInterceptors(RlsTxInterceptor)
export class AnalyticsController {
  private readonly logger = createLogger('controller:analytics');
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get the authenticated user's analytics snapshot.
   *
   * Returns the latest analytics payload, including estimated one-rep max data
   * and goal-adherence metrics. The handler also sets the `X-Cache` response
   * header to indicate whether the payload was served from cache.
   *
   * Route: GET /api/analytics/get
   * Access: User
   */
  @Get('get')
  async getAnalytics(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetAnalyticsResponse> {
    const { payload, cacheHit, analyticsKey } = await this.analyticsService.getAnalyticsData(user.id);

    if (cacheHit) {
      res.set('X-Cache', 'HIT');
      this.logger.info({ event: 'analytics.cache_hit', userId: user.id, analyticsKey }, 'Analytics served from cache');
      return payload;
    }

    res.set('X-Cache', 'MISS');
    return payload;
  }
}
