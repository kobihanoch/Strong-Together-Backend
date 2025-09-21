import sql from "../config/db.js";

export const queryGetExerciseMapByMuscle = async () => {
  const rows = await sql`
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
  `;

  // postgres.js returns an array of rows; we selected a single column aliased as "result"
  const result = rows?.[0]?.result.map; // { map: { ... } }
  return result;
};
