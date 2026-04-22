import { Controller, Get, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type {
  AddWorkoutResponse,
  GetWholeUserWorkoutPlanResponse,
  AddWorkoutBody,
  GetWholeUserWorkoutPlanQuery,
} from '@strong-together/shared';
import { addWorkoutRequest, getWholeWorkoutPlanRequest } from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/auth/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../common/types/express';
import { WorkoutPlanService } from './plan.service';

/**
 * Workout-plan routes for authenticated users.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/workouts/getworkout
 * - POST /api/workouts/add
 *
 * Access: User
 */
@Controller('api/workouts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  /**
   * Get the authenticated user's active workout plan.
   *
   * Returns the current workout plan and editable split structure for the
   * requested timezone, and sets `X-Cache` to reflect cache usage.
   *
   * Route: GET /api/workouts/getworkout
   * Access: User
   */
  @Get('getworkout')
  async getWholeUserWorkoutPlan(
    @RequestData(new ValidateRequestPipe(getWholeWorkoutPlanRequest))
    data: { query: GetWholeUserWorkoutPlanQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWholeUserWorkoutPlanResponse> {
    const tz = data.query.tz;
    const { payload, cacheHit } = await this.workoutPlanService.getWorkoutPlanData(user.id, true, tz);
    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return payload;
  }

  /**
   * Delete a workout owned by the authenticated user.
   *
   * This handler is currently a placeholder and does not perform any action.
   *
   * Route: DELETE /api/workouts/delete
   * Access: User
   */
  async deleteUserWorkout(): Promise<void> {
    return;
  }

  /**
   * Create or replace the authenticated user's workout plan.
   *
   * Persists the submitted workout structure, invalidates related caches,
   * rebuilds the plan snapshot, and returns the updated plan payload.
   *
   * Route: POST /api/workouts/add
   * Access: User
   */
  @Post('add')
  async addWorkout(
    @RequestData(new ValidateRequestPipe(addWorkoutRequest))
    data: { body: AddWorkoutBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AddWorkoutResponse> {
    const payload = await this.workoutPlanService.addWorkoutData(user.id, data.body);
    return payload;
  }
}
