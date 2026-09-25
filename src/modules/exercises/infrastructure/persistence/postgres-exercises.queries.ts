import { Injectable } from '@nestjs/common';
import { FindCatalogueSql } from './reads/find-catalogue.sql';
import type { ExerciseCatalogue } from '../../application/models/exercises.models';
import { ExercisesQueries } from '../../application/ports/exercises.queries';

/** PostgreSQL adapter for exercise-catalogue persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresExercisesQueries implements ExercisesQueries {
  public constructor(private readonly findCatalogueSql: FindCatalogueSql) {}
  findCatalogue(): Promise<ExerciseCatalogue> {
    return this.findCatalogueSql.findCatalogue();
  }
}
