import { Controller, Get, HttpCode, HttpStatus, Put, Res, UseGuards } from '@nestjs/common';
import type { GetWorkoutPlanQuery, GetWorkoutPlanResponse, ReplaceWorkoutPlanBody } from '@strong-together/shared';
import { getWorkoutPlanRequestSchema, replaceWorkoutPlanRequestSchema } from '@strong-together/shared';
import type { Response } from 'express';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { GetWorkoutPlanUseCase } from '../application/use-cases/get-workout-plan.use-case';
import { ReplaceWorkoutPlanUseCase } from '../application/use-cases/replace-workout-plan.use-case';

/** Exposes authenticated workout-plan endpoints. */
@Controller('api/workout-plan')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class WorkoutPlanController {
  constructor(
    private readonly getPlan: GetWorkoutPlanUseCase,
    private readonly replacePlan: ReplaceWorkoutPlanUseCase,
  ) {}
  /** Retrieves the active plan. API: GET /api/workout-plan Access: Authenticated user @param data - Validated timezone. @param user - Authenticated user. @param res - Response used for cache metadata. @returns The active plan payload. */ @Get()
  async getWorkoutPlan(
    @RequestData(new ValidateRequestPipe(getWorkoutPlanRequestSchema)) data: { query: GetWorkoutPlanQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutPlanResponse> {
    const result = await this.getPlan.execute(user.id, true, data.query.tz);
    res.set('X-Cache', result.cacheHit ? 'HIT' : 'MISS');
    return result.payload;
  }
  /**
   * Replaces the active plan.
   * API: PUT /api/workout-plan
   * Access: Authenticated user
   * @param data - Validated plan.
   * @param user - Authenticated user.
   * @returns No body.
   * @throws {InvalidWorkoutSplitError} When an existing split is invalid.
   */
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async replaceWorkoutPlan(
    @RequestData(new ValidateRequestPipe(replaceWorkoutPlanRequestSchema)) data: { body: ReplaceWorkoutPlanBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.replacePlan.execute(user.id, data.body.workoutData);
  }
}
