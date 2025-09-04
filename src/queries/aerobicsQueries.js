import sql from "../config/db.js";

// Gets all records from last 45 days mapped by dates
// { [date1]: record - user_id, [date2]:....}
// Returns null if no results
export const queryGetUserAerobicsForNDays = async (userId, days) => {
  const obj = await sql`
  WITH at_d AS (
    SELECT workout_date AS d, json_agg(to_jsonb(at) - 'user_id') AS records
    FROM aerobicstracking at
    WHERE at.user_id=${userId} AND at.workout_date >= (CURRENT_DATE - ${days}::int)
    GROUP BY at.workout_date
    )
  SELECT jsonb_object_agg(at_d.d, at_d.records) FROM at_d
    `;
  return obj.jsonb_object_agg;
};
