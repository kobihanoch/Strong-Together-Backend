import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import type {
  CreateWorkoutSessionBody,
  GetExerciseHistoryQuery as GetExerciseHistoryRequestQuery,
  GetExerciseHistoryResponse,
  GetPersonalRecordsQuery as GetPersonalRecordsRequestQuery,
  GetPersonalRecordsResponse,
  GetWorkoutHistoryQuery as GetWorkoutHistoryRequestQuery,
  GetWorkoutHistoryResponse,
  GetWorkoutStatisticsResponse,
} from '@strong-together/shared';
import {
  createWorkoutSessionRequestSchema,
  getExerciseHistoryRequestSchema,
  getPersonalRecordsRequestSchema,
  getWorkoutHistoryRequestSchema,
} from '@strong-together/shared';
import type { Response } from 'express';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { CreateWorkoutSessionCommand } from '../application/commands/create-workout-session/create-workout-session.command';
import { GetExerciseHistoryQuery } from '../application/queries/get-exercise-history/get-exercise-history.query';
import { GetPersonalRecordsQuery } from '../application/queries/get-personal-records/get-personal-records.query';
import { GetWorkoutHistoryQuery } from '../application/queries/get-workout-history/get-workout-history.query';
import { GetWorkoutStatisticsQuery } from '../application/queries/get-workout-statistics/get-workout-statistics.query';
/** E */
@Controller('api')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class WorkoutTrackingController {
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  private cache(res: Response, hit: boolean) {
    res.set('X-Cache', hit ? 'HIT' : 'MISS');
  }
  /**
   * Retrieves workout history.
   *
   * API: `GET /api/workout-history`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response used to set response metadata.
   * @returns The endpoint response.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('workout-history')
  async getWorkoutHistory(
    @RequestData(new ValidateRequestPipe(getWorkoutHistoryRequestSchema)) data: { query: GetWorkoutHistoryRequestQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutHistoryResponse> {
    const r = await this.queryBus.execute(new GetWorkoutHistoryQuery(user.id, 45, true, data.query.tz || 'Asia/Jerusalem'));
    this.cache(res, r.cacheHit);
    return r.payload;
  }
  /**
   * Retrieves exercise history.
   *
   * API: `GET /api/exercise-history`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response used to set response metadata.
   * @returns The endpoint response.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('exercise-history')
  async getExerciseHistory(
    @RequestData(new ValidateRequestPipe(getExerciseHistoryRequestSchema)) data: { query: GetExerciseHistoryRequestQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetExerciseHistoryResponse> {
    const r = await this.queryBus.execute(new GetExerciseHistoryQuery(user.id, 45, true, data.query.tz || 'Asia/Jerusalem'));
    this.cache(res, r.cacheHit);
    return r.payload;
  }
  /**
   * Retrieves workout statistics.
   *
   * API: `GET /api/workout-statistics`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response used to set response metadata.
   * @returns The endpoint response.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('workout-statistics')
  async getWorkoutStatistics(
    @RequestData(new ValidateRequestPipe(getWorkoutHistoryRequestSchema)) data: { query: GetWorkoutHistoryRequestQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutStatisticsResponse> {
    const r = await this.queryBus.execute(new GetWorkoutStatisticsQuery(user.id, 45, true, data.query.tz || 'Asia/Jerusalem'));
    this.cache(res, r.cacheHit);
    return r.payload;
  }
  /**
   * Retrieves personal records.
   *
   * API: `GET /api/personal-records`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response used to set response metadata.
   * @returns The endpoint response.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('personal-records')
  async getPersonalRecords(
    @RequestData(new ValidateRequestPipe(getPersonalRecordsRequestSchema)) data: { query: GetPersonalRecordsRequestQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetPersonalRecordsResponse> {
    const r = await this.queryBus.execute(new GetPersonalRecordsQuery(user.id, true, data.query.tz || 'Asia/Jerusalem'));
    this.cache(res, r.cacheHit);
    return r.payload;
  }
  /**
   * Persists a completed workout.
   *
   * API: `POST /api/workout-sessions`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - Completed workout data.
   * @param user - Authenticated user.
   * @returns No body.
   * @throws {WorkoutSessionRequiresExerciseError} When no exercises are supplied.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post('workout-sessions')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createWorkoutSession(
    @RequestData(new ValidateRequestPipe(createWorkoutSessionRequestSchema)) data: { body: CreateWorkoutSessionBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.commandBus.execute(new CreateWorkoutSessionCommand(user.id, data.body));
  }
}
