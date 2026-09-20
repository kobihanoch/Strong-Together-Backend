import { Injectable } from '@nestjs/common';
import { DBService } from '../../../infrastructure/db/db.service';
import type { ExerciseCatalogue } from '../application/models/exercises.models';
import type { ExerciseCatalogueSqlRow } from './exercises.db-types';

/** Executes exercise-catalogue SQL queries. */
@Injectable()
export class ExercisesSql {
  constructor(private readonly dbService: DBService) {}

  async findCatalogue(): Promise<ExerciseCatalogue> {
    const rows = await this.dbService.sql<ExerciseCatalogueSqlRow[]>`
      SELECT jsonb_build_object('map', jsonb_object_agg(t.targetmuscle, t.ex_list)) AS result
      FROM (
        SELECT e.target_muscle AS targetmuscle,
          jsonb_agg(jsonb_build_object('id', e.id, 'name', e.name, 'specificTargetMuscle', e.specific_target_muscle) ORDER BY e.name) AS ex_list
        FROM workout.exercise e
        GROUP BY e.target_muscle
      ) AS t
    `;
    return rows[0]?.result?.map ?? {};
  }
}
