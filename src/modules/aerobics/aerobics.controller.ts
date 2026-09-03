import { Controller, Delete, Get, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type {
  CreateAerobicEntryBody,
  CreateAerobicEntryQuery,
  DeleteAerobicEntryParams,
  DeleteAerobicEntryQuery,
  DeleteAerobicEntryResponse,
  GetAerobicHistoryQuery,
  GetAerobicHistoryResponse,
  UpdateAerobicEntryBody,
  UpdateAerobicEntryParams,
  UpdateAerobicEntryQuery,
  UpdateAerobicEntryResponse,
} from '@strong-together/shared';
import type { AuthenticatedUser } from '../../common/types/express';
import {
  createAerobicEntryRequestSchema,
  deleteAerobicEntryRequestSchema,
  getAerobicHistoryRequestSchema,
  updateAerobicEntryRequestSchema,
} from '@strong-together/shared';
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
 * - GET /api/aerobics
 * - POST /api/aerobics
 * - PUT /api/aerobics/:id
 * - DELETE /api/aerobics/:id
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
   * @remarks Route: GET /api/aerobics
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Get()
  async getAerobicHistory(
    @RequestData(new ValidateRequestPipe(getAerobicHistoryRequestSchema)) data: { query: GetAerobicHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetAerobicHistoryResponse> {
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
   * @remarks Route: POST /api/aerobics
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @returns The response payload.
   */
  @Post()
  async createAerobicEntry(
    @RequestData(new ValidateRequestPipe(createAerobicEntryRequestSchema)) data: {
      query: CreateAerobicEntryQuery;
      body: CreateAerobicEntryBody;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetAerobicHistoryResponse> {
    return this.aerobicsService.createAerobicEntryData(user.id, data.body, data.query.tz || 'Asia/Jerusalem');
  }

  /**
   * Replace an aerobic entry owned by the authenticated user.
   *
   * @remarks Route: PUT /api/aerobics/:id
   * Access: User
   *
   * @param data - The validated path parameters and request body.
   * @param user - The authenticated user.
   * @returns The refreshed aerobic history.
   */
  @Put(':id')
  async updateAerobicEntry(
    @RequestData(new ValidateRequestPipe(updateAerobicEntryRequestSchema)) data: {
      params: UpdateAerobicEntryParams;
      query: UpdateAerobicEntryQuery;
      body: UpdateAerobicEntryBody;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UpdateAerobicEntryResponse> {
    return this.aerobicsService.updateAerobicEntryData(
      user.id,
      data.params.id,
      data.body.record,
      data.query.tz || 'Asia/Jerusalem',
    );
  }

  /**
   * Delete an aerobic entry owned by the authenticated user.
   *
   * @remarks Route: DELETE /api/aerobics/:id
   * Access: User
   *
   * @param data - The validated path parameters and query.
   * @param user - The authenticated user.
   * @returns The refreshed aerobic history.
   */
  @Delete(':id')
  async deleteAerobicEntry(
    @RequestData(new ValidateRequestPipe(deleteAerobicEntryRequestSchema)) data: {
      params: DeleteAerobicEntryParams;
      query: DeleteAerobicEntryQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteAerobicEntryResponse> {
    return this.aerobicsService.deleteAerobicEntryData(
      user.id,
      data.params.id,
      data.query.tz || 'Asia/Jerusalem',
    );
  }
}
