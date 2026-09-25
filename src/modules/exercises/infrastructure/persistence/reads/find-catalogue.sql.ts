import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { ExerciseCatalogueSqlRow } from '../exercises.db-types';

/** Executes exercise-catalogue SQL queries. */

@Injectable()
export class FindCatalogueSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the find catalogue SQL operation.
   *
   * @returns The query result.
   */
  async findCatalogue() {
    const rows = await this.dbService.sql<ExerciseCatalogueSqlRow[]>`
      SELECT
        JSONB_BUILD_OBJECT('map', JSONB_OBJECT_AGG(t.targetmuscle, t.ex_list)) AS result
      FROM
        (
          SELECT
            e.target_muscle AS targetmuscle,
            JSONB_AGG(
              JSONB_BUILD_OBJECT(
                'id',
                e.id,
                'name',
                e.name,
                'specificTargetMuscle',
                e.specific_target_muscle
              )
              ORDER BY
                e.name
            ) AS ex_list
          FROM
            workout.exercise e
          GROUP BY
            e.target_muscle
        ) AS t
    `;
    return rows[0]?.result?.map ?? {};
  }
}
