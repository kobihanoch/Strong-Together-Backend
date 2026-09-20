import { Controller, Get, UseGuards } from '@nestjs/common';
import type { ListExercisesResponse } from '@strong-together/shared';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { ListExercisesUseCase } from '../application/use-cases/list-exercises.use-case';

/** Exposes authenticated exercise-catalogue endpoints. */
@Controller('api/exercises')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class ExercisesController {
  constructor(private readonly listExercises: ListExercisesUseCase) {}

  /**
   * Retrieves the exercise catalogue grouped by target muscle.
   *
   * API: GET /api/exercises
   * Access: Authenticated user
   *
   * @returns The complete grouped exercise catalogue.
   */
  @Get()
  async list(): Promise<ListExercisesResponse> {
    return this.listExercises.execute();
  }
}
