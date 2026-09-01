import { Controller, Get, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type { ReplaceWorkoutPlanResponse, GetWorkoutPlanResponse, ReplaceWorkoutPlanBody, GetWorkoutPlanQuery } from '@strong-together/shared';
import { replaceWorkoutPlanRequestSchema, getWorkoutPlanRequestSchema } from '@strong-together/shared';
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
 * - GET /api/workout-plan
 * - PUT /api/workout-plan
 *
 * Access: User
 */
@Controller('api/workout-plan')
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
   * @remarks Route: GET /api/workout-plan
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Get()
  async getWorkoutPlan(
    @RequestData(new ValidateRequestPipe(getWorkoutPlanRequestSchema))
    data: { query: GetWorkoutPlanQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutPlanResponse> {
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
   * @remarks Route: DELETE /api/workouts/delete
   * Access: User
   */
  async deleteUserWorkout(): Promise<void> {
    return;
  }

  /**
   * Create or update the authenticated user's workout plan.
   *
   * Persists the submitted workout structure, invalidates related caches,
   * rebuilds the plan snapshot, and returns the updated plan payload.
   *
   * @remarks Route: PUT /api/workout-plan
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @returns The response payload.
   */
  @Put()
  async replaceWorkoutPlan(
    @RequestData(new ValidateRequestPipe(replaceWorkoutPlanRequestSchema))
    data: { body: ReplaceWorkoutPlanBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReplaceWorkoutPlanResponse> {
    const payload = await this.workoutPlanService.replaceWorkoutPlanData(user.id, data.body);
    return payload;
  }
}
