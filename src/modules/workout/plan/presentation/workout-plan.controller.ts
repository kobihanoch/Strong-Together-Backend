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

/** E */
@Controller('api/workout-plan')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class WorkoutPlanController {
  constructor(
    private readonly getPlan: GetWorkoutPlanUseCase,
    private readonly replacePlan: ReplaceWorkoutPlanUseCase,
  ) {}
  /**
   * Retrieves the active plan.
   *
   * API: `GET /api/workout-plan`.
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
  @Get()
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
   *
   * API: `PUT /api/workout-plan`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - Validated plan.
   * @param user - Authenticated user.
   * @returns No body.
   * @throws {InvalidWorkoutSplitError} When an existing split is invalid.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
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
