import { Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import type { GetWorkoutSchedulesResponse, ReplaceWorkoutSchedulesBody, ReplaceWorkoutSchedulesResponse } from '@strong-together/shared';
import { replaceWorkoutSchedulesRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../common/types/express';
import { GetWorkoutSchedulesUseCase } from '../application/use-cases/get-workout-schedules.use-case';
import { ReplaceWorkoutSchedulesUseCase } from '../application/use-cases/replace-workout-schedules.use-case';

/** E */
@Controller('api/workout-schedules')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class WorkoutScheduleController {
  public constructor(
    private readonly getWorkoutSchedules: GetWorkoutSchedulesUseCase,
    private readonly replaceWorkoutSchedules: ReplaceWorkoutSchedulesUseCase,
  ) {}

  /**
   * Retrieves the authenticated user's active weekly workout schedule.
   *
   * API: `GET /api/workout-schedules`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param user - The authenticated user.
   * @returns Schedule entries attached to active splits in the active plan.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  public get(@CurrentUser() user: AuthenticatedUser): Promise<GetWorkoutSchedulesResponse> {
    return this.getWorkoutSchedules.execute(user.id);
  }

  /**
   * Replaces the authenticated user's complete weekly workout schedule.
   *
   * API: `PUT /api/workout-schedules`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated complete schedule replacement.
   * @param user - The authenticated user.
   * @returns No response body.
   * @throws {InvalidWorkoutScheduleSplitError} When a split is inactive or belongs to another plan.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async replace(
    @RequestData(new ValidateRequestPipe(replaceWorkoutSchedulesRequestSchema))
    data: { body: ReplaceWorkoutSchedulesBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReplaceWorkoutSchedulesResponse> {
    await this.replaceWorkoutSchedules.execute(user.id, data.body.schedules);
  }
}
