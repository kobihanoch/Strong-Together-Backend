import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get, HttpCode, HttpStatus, Put, Res, UseGuards } from '@nestjs/common';
import type { GetWorkoutPlanQuery as GetWorkoutPlanRequestQuery, GetWorkoutPlanResponse, ReplaceWorkoutPlanBody } from '@strong-together/shared';
import { getWorkoutPlanRequestSchema, replaceWorkoutPlanRequestSchema } from '@strong-together/shared';
import type { Response } from 'express';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { GetWorkoutPlanQuery } from '../application/queries/get-workout-plan/get-workout-plan.query';
import { ReplaceWorkoutPlanCommand } from '../application/commands/replace-workout-plan/replace-workout-plan.command';

/** E */
@Controller('api/workout-plan')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class WorkoutPlanController {
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
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
    @RequestData(new ValidateRequestPipe(getWorkoutPlanRequestSchema)) data: { query: GetWorkoutPlanRequestQuery },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetWorkoutPlanResponse> {
    const result = await this.queryBus.execute(new GetWorkoutPlanQuery(user.id, true, data.query.tz));
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
    await this.commandBus.execute(new ReplaceWorkoutPlanCommand(user.id, data.body.workoutData));
  }
}
