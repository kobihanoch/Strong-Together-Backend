import { Injectable } from '@nestjs/common';
import type { ExerciseCatalogue } from '../application/models/exercises.models';
import { ExercisesRepository } from '../application/ports/exercises.repository';
import { ExercisesSql } from './exercises.sql';

/** PostgreSQL adapter for exercise-catalogue persistence. */
@Injectable()
export class PostgresExercisesRepository implements ExercisesRepository {
  constructor(private readonly sql: ExercisesSql) {}
  findCatalogue(): Promise<ExerciseCatalogue> {
    return this.sql.findCatalogue();
  }
}
