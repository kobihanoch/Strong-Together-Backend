import { Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type { AddUserAerobicsBody, GetUserAerobicsQuery, UserAerobicsResponse } from '@strong-together/shared';
import type { AuthenticatedUser } from '../../common/types/express';
import { addAerobicsRequest, getAerobicsRequest } from '@strong-together/shared';
import { AerobicsService } from './aerobics.service';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';

/**
 * Aerobics routes for authenticated users.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/aerobics/get
 * - POST /api/aerobics/add
 *
 * Access: User
 */
@Controller('api/aerobics')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
@UseInterceptors(RlsTxInterceptor)
export class AerobicsController {
  constructor(private readonly aerobicsService: AerobicsService) {}

  /**
   * Get the authenticated user's aerobics history for the last 45 days.
   *
   * Returns grouped aerobics data resolved in the user's requested timezone and
   * sets the `X-Cache` response header to indicate whether the payload was served
   * from cache.
   *
   * Route: GET /api/aerobics/get
   * Access: User
   */
  @Get('get')
  async getUserAerobics(
    @RequestData(new ValidateRequestPipe(getAerobicsRequest)) data: { query: GetUserAerobicsQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserAerobicsResponse> {
    const tz = data.query.tz;
    const { payload, cacheHit } = await this.aerobicsService.getAerobicsData(user.id, 45, true, tz);

    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Create a new aerobics tracking record for the authenticated user.
   *
   * Persists the submitted aerobics entry, refreshes the user's aerobics cache,
   * and returns the updated aerobics snapshot for the requested timezone.
   *
   * Route: POST /api/aerobics/add
   * Access: User
   */
  @Post('add')
  async addUserAerobics(
    @RequestData(new ValidateRequestPipe(addAerobicsRequest)) data: { body: AddUserAerobicsBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserAerobicsResponse> {
    return this.aerobicsService.addUserAerobicsRecord(user.id, data.body);
  }
}
