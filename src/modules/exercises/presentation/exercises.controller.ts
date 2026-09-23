import { Controller, Get, UseGuards } from '@nestjs/common';
import type { ListExercisesResponse } from '@strong-together/shared';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { ListExercisesUseCase } from '../application/use-cases/list-exercises.use-case';

/** E */
@Controller('api/exercises')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class ExercisesController {
  constructor(private readonly listExercises: ListExercisesUseCase) {}

  /**
   * Retrieves the exercise catalogue grouped by target muscle.
   *
   * API: `GET /api/exercises`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @returns The complete grouped exercise catalogue.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  async list(): Promise<ListExercisesResponse> {
    return this.listExercises.execute();
  }
}
