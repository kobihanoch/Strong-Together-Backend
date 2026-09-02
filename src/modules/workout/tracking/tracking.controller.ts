import { Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type {
  CreateWorkoutSessionResponse,
  GetWorkoutHistoryResponse,
  GetExerciseHistoryResponse,
  GetWorkoutStatisticsResponse,
  CreateWorkoutSessionBody,
  GetWorkoutHistoryQuery,
  GetPersonalRecordsResponse,
} from '@strong-together/shared';
import { createWorkoutSessionRequestSchema, getWorkoutHistoryRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/auth/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../common/types/express';
import { WorkoutTrackingService } from './tracking.service';

/**
 * Workout-tracking routes for authenticated users.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/workout-history
 * - GET /api/exercise-history
 * - GET /api/workout-statistics
 * - GET /api/personal-records
 * - POST /api/workout-sessions
 *
 * Access: User
 */
@Controller('api')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class WorkoutTrackingController {
  constructor(private readonly workoutTrackingService: WorkoutTrackingService) {}

  /**
   * Get the authenticated user's recent exercise tracking history.
   *
   * Returns grouped tracking maps for the last 45 days in the requested timezone
   * and sets `X-Cache` to reflect cache usage.
   *
   * @remarks Route: GET /api/workout-history
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Get('workout-history')
  async getWorkoutHistory(
    @RequestData(new ValidateRequestPipe(getWorkoutHistoryRequestSchema)) data: { query: GetWorkoutHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutHistoryResponse> {
    const tz = data.query.tz || 'Asia/Jerusalem';

    const { payload, cacheHit } = await this.workoutTrackingService.getWorkoutHistoryData(user.id, 45, true, tz);
    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Get the authenticated user's exercise history grouped by exercise assignment.
   *
   * Returns tracking from the last 45 days, with each assignment's entries
   * ordered from newest to oldest, and sets `X-Cache` to reflect cache usage.
   *
   * @remarks Route: GET /api/exercise-history
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns The exercise history grouped by exercise-to-split identifier.
   */
  @Get('exercise-history')
  async getExerciseHistory(
    @RequestData(new ValidateRequestPipe(getWorkoutHistoryRequestSchema)) data: { query: GetWorkoutHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetExerciseHistoryResponse> {
    const tz = data.query.tz || 'Asia/Jerusalem';
    const { payload, cacheHit } = await this.workoutTrackingService.getExerciseHistoryData(user.id, 45, true, tz);
    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Get the authenticated user's exercise tracking stats.
   *
   * Returns tracking analytics and sets `X-Cache` to reflect cache usage.
   *
   * @remarks Route: GET /api/workout-statistics
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Get('workout-statistics')
  async getWorkoutStatistics(
    @RequestData(new ValidateRequestPipe(getWorkoutHistoryRequestSchema)) data: { query: GetWorkoutHistoryQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutStatisticsResponse> {
    const tz = data.query.tz || 'Asia/Jerusalem';

    const { payload, cacheHit } = await this.workoutTrackingService.getWorkoutStatisticsData(user.id, 45, true, tz);
    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Get all current personal records for the authenticated user.
   *
   * Returns the strongest logged set for every tracked exercise as an object
   * keyed by exercise identifier. Sets `X-Cache` to reflect cache usage.
   *
   * @remarks Route: GET /api/personal-records
   * Access: User
   *
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns All current personal records.
   */
  @Get('personal-records')
  async getPersonalRecords(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetPersonalRecordsResponse> {
    const { payload, cacheHit } = await this.workoutTrackingService.getPersonalRecordsData(user.id, true);
    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Persist a completed workout for the authenticated user.
   *
   * Stores the submitted workout summary and tracking rows, refreshes tracking
   * cache state, and returns the updated tracking payload.
   *
   * @remarks Route: POST /api/workout-sessions
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @returns The response payload.
   */
  @Post('workout-sessions')
  async createWorkoutSession(
    @RequestData(new ValidateRequestPipe(createWorkoutSessionRequestSchema)) data: { body: CreateWorkoutSessionBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CreateWorkoutSessionResponse> {
    const payload = await this.workoutTrackingService.createWorkoutSessionData(user.id, data.body);
    return payload;
  }
}
