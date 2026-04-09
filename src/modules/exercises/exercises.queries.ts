import sql from '../../infrastructure/db.client.ts';
import type { ExercisesMapByMuscle, QueryGetExerciseMapByMuscleRow } from '@strong-together/shared';

export const queryGetExerciseMapByMuscle = async (): Promise<ExercisesMapByMuscle> => {
  const rows = (await sql`
    SELECT jsonb_build_object(
      'map',
      jsonb_object_agg(t.targetmuscle, t.ex_list)
    ) AS result
    FROM (
      SELECT
        e.targetmuscle,
        jsonb_agg(
          jsonb_build_object(
            'id', e.id,
            'name', e.name,
            'specificTargetMuscle', e.specifictargetmuscle
          )
          ORDER BY e.name
        ) AS ex_list
      FROM exercises e
      GROUP BY e.targetmuscle
    ) AS t
  `) as QueryGetExerciseMapByMuscleRow[];

  // postgres.js returns an array of rows; we selected a single column aliased as "result"
  return rows[0]?.result?.map ?? {};
};
