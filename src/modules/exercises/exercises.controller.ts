import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import type { GetAllExercisesResponse } from '@strong-together/shared';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { ExercisesService } from './exercises.service.ts';

/**
 * Exercise routes for authenticated users.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - GET /api/exercises/getall
 *
 * Access: User
 */
@Controller('api/exercises')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

/**
 * Get the exercise catalog grouped for workout-building flows.
 *
 * Returns the full exercise map used by the client when composing or editing
 * workout plans.
 *
 * Route: GET /api/exercises/getall
 * Access: User
 */
  @Get('getall')
  async getAllExercises(): Promise<GetAllExercisesResponse> {
    return this.exercisesService.getAllExercisesData();
  }
}
