ALTER TABLE IF EXISTS "public"."user_reminder_settings" SET SCHEMA "reminders";
ALTER TABLE IF EXISTS "public"."user_split_information" SET SCHEMA "reminders";

ALTER SEQUENCE IF EXISTS "public"."user_split_information_id_seq" SET SCHEMA "reminders";
ALTER SEQUENCE IF EXISTS "public"."user_split_information_id_seq1" SET SCHEMA "reminders";

DROP FUNCTION IF EXISTS "public"."refresh_user_split_information"();

CREATE OR REPLACE FUNCTION "reminders"."refresh_user_split_information"() RETURNS "void"
    LANGUAGE "sql"
    AS $$
WITH recent_workouts AS (
  SELECT
    ws.user_id,
    ws.workoutsplit_id AS split_id,
    ws.workout_end_utc,
    ws.workout_start_utc
  FROM tracking.exercisetracking et
  JOIN tracking.workout_summary ws
    ON ws.id = et.workout_summary_id
  WHERE
    ws.workout_start_utc >= timezone('UTC', now()) - INTERVAL '21 days'
    AND ws.workoutsplit_id IS NOT NULL
),
weekday_counts AS (
  SELECT
    rw.user_id,
    rw.split_id,
    EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone) AS weekday,
    COUNT(*) AS cnt,
    ROW_NUMBER() OVER (
      PARTITION BY rw.user_id, rw.split_id
      ORDER BY COUNT(*) DESC
    ) AS rn
  FROM recent_workouts rw
  join reminders.user_reminder_settings urs on urs.user_id = rw.user_id
  GROUP BY rw.user_id, rw.split_id, EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone)
),
filtered AS (
  SELECT
    rw.user_id,
    rw.split_id,
    rw.workout_start_utc AS adjusted_time_utc,
    EXTRACT(DOW FROM rw.workout_start_utc) AS weekday
  FROM recent_workouts rw
  JOIN weekday_counts wc
    ON wc.user_id = rw.user_id
   AND wc.split_id = rw.split_id
   AND wc.weekday = EXTRACT(DOW FROM rw.workout_start_utc)
   AND wc.rn = 1
),
aggregated AS (
  SELECT
    f.user_id,
    f.split_id,
    wc.weekday AS preferred_weekday,
    COUNT(*) AS total_cnt,
    FLOOR(
      AVG( (EXTRACT(EPOCH FROM f.adjusted_time_utc)) % 86400 )
    )::int AS avg_seconds_in_day
  FROM filtered f
  JOIN weekday_counts wc
    ON wc.user_id = f.user_id
   AND wc.split_id = f.split_id
   AND wc.weekday = f.weekday
   AND wc.rn = 1
  GROUP BY f.user_id, f.split_id, wc.weekday
),
finalized AS (
  SELECT
    a.user_id,
    a.split_id,
    (
      DATE_TRUNC('day', timezone('UTC', now()))
      + make_interval(secs => a.avg_seconds_in_day)
    ) AS estimated_time_utc,
    a.preferred_weekday,
    a.total_cnt
  FROM aggregated a
)
INSERT INTO reminders.user_split_information (
  user_id,
  split_id,
  estimated_time_utc,
  confidence,
  last_computed_at,
  preferred_weekday
)
SELECT
  f.user_id,
  f.split_id,
  f.estimated_time_utc,
  CASE
    WHEN f.total_cnt >= 3 THEN 1.00
    WHEN f.total_cnt = 2 THEN 0.60
    ELSE 0.30
  END AS confidence,
  timezone('UTC', now()) AS last_computed_at,
  f.preferred_weekday
FROM finalized f
ON CONFLICT (user_id, split_id)
DO UPDATE
  SET estimated_time_utc = EXCLUDED.estimated_time_utc,
      confidence = EXCLUDED.confidence,
      last_computed_at = EXCLUDED.last_computed_at,
      preferred_weekday = EXCLUDED.preferred_weekday;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'cron') THEN
    PERFORM cron.schedule(
      'refresh-user-split-information-daily',
      '0 2 * * *',
      'SELECT reminders.refresh_user_split_information();'
    );
  END IF;
END
$$;

COMMENT ON SCHEMA "reminders" IS 'Reminder preferences and computed split reminder metadata';
