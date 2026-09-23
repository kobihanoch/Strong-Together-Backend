import { Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import type {
  CreateWorkoutSessionBody,
  GetExerciseHistoryQuery,
  GetExerciseHistoryResponse,
  GetPersonalRecordsQuery,
  GetPersonalRecordsResponse,
  GetWorkoutHistoryQuery,
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
import { CreateWorkoutSessionUseCase } from '../application/use-cases/create-workout-session.use-case';
import { GetExerciseHistoryUseCase } from '../application/use-cases/get-exercise-history.use-case';
import { GetPersonalRecordsUseCase } from '../application/use-cases/get-personal-records.use-case';
import { GetWorkoutHistoryUseCase } from '../application/use-cases/get-workout-history.use-case';
import { GetWorkoutStatisticsUseCase } from '../application/use-cases/get-workout-statistics.use-case';
/** E */
@Controller('api')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class WorkoutTrackingController {
  constructor(
    private readonly history: GetWorkoutHistoryUseCase,
    private readonly exerciseHistory: GetExerciseHistoryUseCase,
    private readonly statistics: GetWorkoutStatisticsUseCase,
    private readonly records: GetPersonalRecordsUseCase,
    private readonly createSession: CreateWorkoutSessionUseCase,
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
    @RequestData(new ValidateRequestPipe(getWorkoutHistoryRequestSchema)) data: { query: GetWorkoutHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutHistoryResponse> {
    const r = await this.history.execute(user.id, 45, true, data.query.tz || 'Asia/Jerusalem');
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
    @RequestData(new ValidateRequestPipe(getExerciseHistoryRequestSchema)) data: { query: GetExerciseHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetExerciseHistoryResponse> {
    const r = await this.exerciseHistory.execute(user.id, 45, true, data.query.tz || 'Asia/Jerusalem');
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
    @RequestData(new ValidateRequestPipe(getWorkoutHistoryRequestSchema)) data: { query: GetWorkoutHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutStatisticsResponse> {
    const r = await this.statistics.execute(user.id, 45, true, data.query.tz || 'Asia/Jerusalem');
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
    @RequestData(new ValidateRequestPipe(getPersonalRecordsRequestSchema)) data: { query: GetPersonalRecordsQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetPersonalRecordsResponse> {
    const r = await this.records.execute(user.id, true, data.query.tz || 'Asia/Jerusalem');
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
   * @throws {InvalidCompletedWorkoutError} When no exercises are supplied.
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
    await this.createSession.execute(user.id, data.body);
  }
}
