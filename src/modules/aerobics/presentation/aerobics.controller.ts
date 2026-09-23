import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type {
  CreateAerobicEntryBody,
  CreateAerobicEntryQuery,
  DeleteAerobicEntryParams,
  DeleteAerobicEntryQuery,
  GetAerobicHistoryQuery,
  GetAerobicHistoryResponse,
  UpdateAerobicEntryBody,
  UpdateAerobicEntryParams,
  UpdateAerobicEntryQuery,
} from '@strong-together/shared';
import type { AuthenticatedUser } from '../../../common/types/express';
import {
  createAerobicEntryRequestSchema,
  deleteAerobicEntryRequestSchema,
  getAerobicHistoryRequestSchema,
  updateAerobicEntryRequestSchema,
} from '@strong-together/shared';
import { CreateAerobicEntryUseCase } from '../application/use-cases/create-aerobic-entry.use-case';
import { DeleteAerobicEntryUseCase } from '../application/use-cases/delete-aerobic-entry.use-case';
import { GetAerobicHistoryUseCase } from '../application/use-cases/get-aerobic-history.use-case';
import { UpdateAerobicEntryUseCase } from '../application/use-cases/update-aerobic-entry.use-case';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';

/** Aerobics routes for authenticated users. */
@Controller('api/aerobics')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class AerobicsController {
  constructor(
    private readonly getAerobicHistoryUseCase: GetAerobicHistoryUseCase,
    private readonly createAerobicEntryUseCase: CreateAerobicEntryUseCase,
    private readonly updateAerobicEntryUseCase: UpdateAerobicEntryUseCase,
    private readonly deleteAerobicEntryUseCase: DeleteAerobicEntryUseCase,
  ) {}

  /**
   * Get the authenticated user's aerobics history for the last 45 days.
   *
   * Returns grouped aerobics data resolved in the user's requested timezone and
   * sets the `X-Cache` response header to indicate whether the payload was served
   * from cache.
   *
   * API: `GET /api/aerobics`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns The response payload.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  async getAerobicHistory(
    @RequestData(new ValidateRequestPipe(getAerobicHistoryRequestSchema)) data: { query: GetAerobicHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetAerobicHistoryResponse> {
    const tz = data.query.tz;
    const { payload, cacheHit } = await this.getAerobicHistoryUseCase.execute(user.id, 45, true, tz);

    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Create a new aerobics tracking record for the authenticated user.
   *
   * Persists the submitted aerobics entry, deletes its exact 45-day cache key,
   * and responds with 204 No Content.
   *
   * API: `POST /api/aerobics`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @returns A promise that resolves with no response body after creation.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createAerobicEntry(
    @RequestData(new ValidateRequestPipe(createAerobicEntryRequestSchema))
    data: {
      query: CreateAerobicEntryQuery;
      body: CreateAerobicEntryBody;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.createAerobicEntryUseCase.execute(user.id, data.body.record);
  }

  /**
   * Replaces an owned aerobic entry, deletes its exact 45-day cache key, and
   * responds with 204 No Content.
   *
   * API: `PUT /api/aerobics/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated path parameters and request body.
   * @param user - The authenticated user.
   * @returns A promise that resolves with no response body after the update.
   * @throws {AerobicEntryNotFoundError} When the owned aerobic entry does not exist.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateAerobicEntry(
    @RequestData(new ValidateRequestPipe(updateAerobicEntryRequestSchema))
    data: {
      params: UpdateAerobicEntryParams;
      query: UpdateAerobicEntryQuery;
      body: UpdateAerobicEntryBody;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.updateAerobicEntryUseCase.execute(user.id, data.params.id, data.body.record);
  }

  /**
   * Deletes an owned aerobic entry, deletes its exact 45-day cache key, and
   * responds with 204 No Content.
   *
   * API: `DELETE /api/aerobics/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated path parameters and query.
   * @param user - The authenticated user.
   * @returns A promise that resolves with no response body after deletion.
   * @throws {AerobicEntryNotFoundError} When the owned aerobic entry does not exist.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAerobicEntry(
    @RequestData(new ValidateRequestPipe(deleteAerobicEntryRequestSchema))
    data: {
      params: DeleteAerobicEntryParams;
      query: DeleteAerobicEntryQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteAerobicEntryUseCase.execute(user.id, data.params.id);
  }
}
