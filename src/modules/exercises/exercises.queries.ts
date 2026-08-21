import { Inject, Injectable } from '@nestjs/common';
import type { ExercisesMapByMuscleQueryDto, ExerciseMapByMuscleRowQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

@Injectable()
export class ExercisesQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryGetExerciseMapByMuscle(): Promise<ExercisesMapByMuscleQueryDto> {
    const rows = await this.sql<ExerciseMapByMuscleRowQueryDto[]>`
      SELECT jsonb_build_object(
        'map',
        jsonb_object_agg(t.targetmuscle, t.ex_list)
      ) AS result
      FROM (
        SELECT
          e.target_muscle AS targetmuscle,
          jsonb_agg(
            jsonb_build_object(
              'id', e.id,
              'name', e.name,
              'specificTargetMuscle', e.specific_target_muscle
            )
            ORDER BY e.name
          )
          AS ex_list
        FROM workout.exercise e
        GROUP BY e.target_muscle
      ) AS t
    `;

    // postgres.js returns an array of rows; we selected a single column aliased as "result"
    return rows[0]?.result?.map ?? {};
  }
}
