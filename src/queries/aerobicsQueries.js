import sql from "../config/db.js";

// Gets all records from last 45 days mapped by dates
/**
 * {
 *    daily: {date1: [...records], date2: [...records],...}},
 *    weekly: {startofweek1: [...records], startofweek2: [...records],...}
 * }
 */
export const queryGetUserAerobicsForNDays = async (userId, days) => {
  const [obj] = await sql`
  /* Base is last N days of user records */
  WITH base AS (
    SELECT workout_date::date AS date, id, (to_jsonb(at) - 'user_id' - 'workout_date' - 'id') AS row
    FROM aerobictracking at
    WHERE at.user_id=${userId} AND at.workout_date >= (CURRENT_DATE - ${days}::int)
  ), 
  /* Norm is gathering relevant information for later */
  norm AS (
    SELECT b.row, b.date, b.id, (b.date::date - EXTRACT(dow FROM b.date::date)::int)::date AS week_start
    FROM base b
  ),
  /* Daily map */
  daily AS (
    SELECT n.date::text AS d, jsonb_agg(n.row ORDER BY n.id ASC) AS records
    FROM norm n
    GROUP BY n.date
  ), 
  /* Weekly map */
  weekly AS (
    SELECT n.week_start::text AS ws, jsonb_agg(n.row ORDER BY n.id ASC) AS records
    FROM norm n
    GROUP BY n.week_start
  )
  /* Final result */
  SELECT jsonb_build_object(
    'daily', COALESCE((SELECT jsonb_object_agg(d.d, d.records) FROM daily d), '{}'::jsonb),
    'weekly', COALESCE((SELECT jsonb_object_agg(w.ws, w.records) FROM weekly w), '{}'::jsonb)
    ) AS data
    `;

  return obj.data;
};

// Add a new aerobic record
export const queryAddAerobicTracking = async (userId, record) => {
  const { durationMins, durationSec, type } = record;
  await sql`INSERT INTO aerobicstracking (user_id, type, duration_mins, duration_sec) VALUES (${userId}, ${type}, ${durationMins}, ${durationSec})`;
};
