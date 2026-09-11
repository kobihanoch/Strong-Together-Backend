import { Controller, Get, HttpCode, HttpStatus, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import type { GetWorkoutSchedulesResponse, ReplaceWorkoutSchedulesBody } from '@strong-together/shared';
import { replaceWorkoutSchedulesRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../common/types/express';
import { WorkoutScheduleService } from './workout-schedule.service';

/**
 * Workout-schedule routes for authenticated users.
 *
 * Exposes the user's active weekly schedule and complete replacement flow:
 * - GET /api/workout-schedules
 * - PUT /api/workout-schedules
 *
 * Access: User
 */
@Controller('api/workout-schedules')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class WorkoutScheduleController {
  constructor(private readonly workoutScheduleService: WorkoutScheduleService) {}

  /**
   * Get the authenticated user's active weekly workout schedule.
   *
   * Only schedule rows attached to active splits in the active workout plan
   * are returned.
   *
   * @remarks Route: GET /api/workout-schedules
   * Access: User
   *
   * @param user - The authenticated user.
   * @returns The workout-schedule response payload.
   */
  @Get()
  async getWorkoutSchedules(@CurrentUser() user: AuthenticatedUser): Promise<GetWorkoutSchedulesResponse> {
    return this.workoutScheduleService.getWorkoutSchedulesData(user.id);
  }

  /**
   * Replace the authenticated user's complete weekly workout schedule.
   *
   * Existing rows are deleted and the submitted rows are inserted atomically.
   * An empty schedules array clears the user's schedule.
   *
   * @remarks Route: PUT /api/workout-schedules
   * Access: User
   *
   * @param data - The validated replacement schedule request.
   * @param user - The authenticated user.
   */
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async replaceWorkoutSchedules(
    @RequestData(new ValidateRequestPipe(replaceWorkoutSchedulesRequestSchema))
    data: { body: ReplaceWorkoutSchedulesBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.workoutScheduleService.replaceWorkoutSchedulesData(user.id, data.body);
  }
}
