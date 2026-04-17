import { Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type {
  FinishUserWorkoutResponse,
  GetExerciseTrackingResponse,
  FinishUserWorkoutBody,
  GetExerciseTrackingQuery,
} from '@strong-together/shared';
import { finishWorkoutRequest, getExerciseTrackingRequest } from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.ts';
import { RequestData } from '../../../common/decorators/request-data.decorator.ts';
import { AuthenticationGuard } from '../../../common/guards/auth/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../../common/guards/auth/authorization.guard.ts';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe.ts';
import type { AuthenticatedUser } from '../../../common/types/express.ts';
import { WorkoutTrackingService } from './tracking.service.ts';

/**
 * Workout-tracking routes for authenticated users.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/workouts/gettracking
 * - POST /api/workouts/finishworkout
 *
 * Access: User
 */
@Controller('api/workouts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class WorkoutTrackingController {
  constructor(private readonly workoutTrackingService: WorkoutTrackingService) {}

  /**
   * Get the authenticated user's recent exercise tracking history.
   *
   * Returns tracking analytics and grouped tracking maps for the last 45 days in
   * the requested timezone, and sets `X-Cache` to reflect cache usage.
   *
   * Route: GET /api/workouts/gettracking
   * Access: User
   */
  @Get('gettracking')
  async getExerciseTracking(
    @RequestData(new ValidateRequestPipe(getExerciseTrackingRequest))
    data: { query: GetExerciseTrackingQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetExerciseTrackingResponse> {
    const tz = data.query.tz as string;

    const { payload, cacheHit } = await this.workoutTrackingService.getExerciseTrackingData(user.id, 45, true, tz);
    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Persist a completed workout for the authenticated user.
   *
   * Stores the submitted workout summary and tracking rows, refreshes tracking
   * cache state, and returns the updated tracking payload.
   *
   * Route: POST /api/workouts/finishworkout
   * Access: User
   */
  @Post('finishworkout')
  async finishUserWorkout(
    @RequestData(new ValidateRequestPipe(finishWorkoutRequest))
    data: { body: FinishUserWorkoutBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<FinishUserWorkoutResponse> {
    const payload = await this.workoutTrackingService.finishUserWorkoutData(user.id, data.body);
    return payload;
  }
}
