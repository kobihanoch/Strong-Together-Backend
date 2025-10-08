import sql from "../config/db.js";

// Gets all records from last 45 days mapped by dates
/**
 *  "daily": {
        "2025-09-02": [
            {
                "type": "Walk",
                "duration_sec": 0,
                "duration_mins": 30
            }
        ],
        "2025-09-03": [
            {
                "type": "Walk",
                "duration_sec": 0,
                "duration_mins": 30
            }
        ],
        "2025-09-04": [
            {
                "type": "Walk",
                "duration_sec": 0,
                "duration_mins": 30
            }
        ]
    },
    "weekly": {
        "2025-08-31": {
            "records": [
                {
                    "type": "Walk",
                    "duration_sec": 0,
                    "workout_date": "2025-09-02",
                    "duration_mins": 30
                },
                {
                    "type": "Walk",
                    "duration_sec": 0,
                    "workout_date": "2025-09-03",
                    "duration_mins": 30
                },
                {
                    "type": "Walk",
                    "duration_sec": 0,
                    "workout_date": "2025-09-04",
                    "duration_mins": 30
                }
            ],
            "total_duration_sec": 0,
            "total_duration_mins": 90
        }
    }
 */
// Exact same response contract, except:
// 1) Grouping is by local date derived from workout_time_utc in the provided tz
// 2) In the weekly records array, we attach 'workout_time_utc' as the local timestamp (string) in that tz

export const queryGetUserAerobicsForNDays = async (
  userId,
  days,
  tz = "Asia/Jerusalem"
) => {
  const [obj] = await sql`
  /* Normalize parameters (default tz to UTC if empty) */
  WITH params AS (
    SELECT
      ${userId}::uuid                    AS user_id,
      ${days}::int                       AS days,
      COALESCE(NULLIF(${tz}, ''), 'UTC') AS tz
  ),

  /* Base is last N days filtered in UTC, but we also compute the local timestamp in the given tz */
  base AS (
    SELECT
      at.id,
      at.duration_mins        AS dm,
      at.duration_sec         AS ds,
      /* Convert timestamptz to local time in tz (timestamp without time zone) */
      (at.workout_time_utc AT TIME ZONE (SELECT tz FROM params)) AS local_ts,
      /* Local date derived from the local timestamp */
      (at.workout_time_utc AT TIME ZONE (SELECT tz FROM params))::date AS local_date,
      /* Keep row payload but drop keys we re-add or don't need */
      (to_jsonb(at) - 'user_id' - 'workout_time_utc' - 'id') AS row
    FROM aerobictracking at, params p
    WHERE at.user_id = p.user_id
      AND at.workout_time_utc >= (NOW() AT TIME ZONE 'UTC' - (p.days || ' days')::interval)
  ),

  /* Norm is gathering relevant information for later (week starts on Sunday, like your original DOW logic) */
  norm AS (
    SELECT
      b.row,
      b.dm,
      b.ds,
      b.id,
      b.local_ts,
      b.local_date,
      /* Compute week_start from local_date */
      (b.local_date::date - EXTRACT(dow FROM b.local_date::date)::int)::date AS week_start
    FROM base b
  ),

  /* Daily map: key is local_date (text), value is array of rows */
  daily AS (
    SELECT
      n.local_date::text AS d,
      jsonb_agg(n.row ORDER BY n.id ASC) AS records
    FROM norm n
    GROUP BY n.local_date
  ),

  /* Weekly map:
     - totals are per week (same as before)
     - records array contains each row payload with an extra 'workout_time_utc'
       that is actually the local timestamp string in the given tz (by your request) */
  weekly AS (
    SELECT
      n.week_start::text AS ws,
      jsonb_build_object(
        'total_duration_mins', SUM(n.dm),
        'total_duration_sec', SUM(n.ds),
        'records',
          jsonb_agg(
            to_jsonb(n.row)
            || jsonb_build_object('workout_time_utc', n.local_ts::text)
            ORDER BY n.id ASC
          )
      ) AS records
    FROM norm n
    GROUP BY n.week_start
  )

  /* Final result: identical structure to your current response */
  SELECT jsonb_build_object(
    'daily',  COALESCE((SELECT jsonb_object_agg(d.d, d.records) FROM daily d),  '{}'::jsonb),
    'weekly', COALESCE((SELECT jsonb_object_agg(w.ws, w.records) FROM weekly w), '{}'::jsonb)
  ) AS data
  `;

  return obj.data;
};

// Add a new aerobic record
export const queryAddAerobicTracking = async (userId, record) => {
  const { durationMins, durationSec, type } = record;
  await sql`INSERT INTO aerobictracking (user_id, type, duration_mins, duration_sec) VALUES (${userId}, ${type}, ${durationMins}, ${durationSec})`;
};
