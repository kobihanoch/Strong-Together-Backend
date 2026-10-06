-- Keep the existing behavior while updating references to normalized table names.
CREATE OR REPLACE FUNCTION "tracking"."housekeeping_compact_old_workouts"()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $$
WITH today_utc AS (
  SELECT (now() AT TIME ZONE 'UTC')::date AS d
), days AS (
  SELECT ws.user_id, (ws.workout_start_utc AT TIME ZONE 'UTC')::date AS d
  FROM tracking.exercise_tracking et
  JOIN tracking.workout_summary ws ON ws.id = et.workout_summary_id
  GROUP BY ws.user_id, d
), ranked_days AS (
  SELECT user_id, d, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d DESC) AS day_rank
  FROM days
), old_days AS (
  SELECT rd.user_id, rd.d
  FROM ranked_days rd
  CROSS JOIN today_utc t
  WHERE rd.day_rank > 35 AND rd.d < (t.d - INTERVAL '45 days')
)
DELETE FROM tracking.exercise_tracking et
USING tracking.workout_summary ws, old_days od
WHERE et.workout_summary_id = ws.id
  AND ws.user_id = od.user_id
  AND (ws.workout_start_utc AT TIME ZONE 'UTC')::date = od.d;
$$;--> statement-breakpoint

-- Keep the existing calculation and normalize only database object references.
CREATE OR REPLACE FUNCTION "reminders"."refresh_user_split_information"()
RETURNS void
LANGUAGE sql
AS $$
WITH recent_workouts AS (
  SELECT ws.user_id, ws.workout_split_id, ws.workout_end_utc, ws.workout_start_utc
  FROM tracking.exercise_tracking et
  JOIN tracking.workout_summary ws ON ws.id = et.workout_summary_id
  WHERE ws.workout_start_utc >= timezone('UTC', now()) - INTERVAL '21 days'
    AND ws.workout_split_id IS NOT NULL
), weekday_counts AS (
  SELECT rw.user_id, rw.workout_split_id,
    EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone) AS weekday,
    COUNT(*) AS cnt,
    ROW_NUMBER() OVER (PARTITION BY rw.user_id, rw.workout_split_id ORDER BY COUNT(*) DESC) AS rn
  FROM recent_workouts rw
  JOIN reminders.user_reminder_setting urs ON urs.user_id = rw.user_id
  GROUP BY rw.user_id, rw.workout_split_id, EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone)
), filtered AS (
  SELECT rw.user_id, rw.workout_split_id, rw.workout_start_utc AS adjusted_time_utc,
    EXTRACT(DOW FROM rw.workout_start_utc) AS weekday
  FROM recent_workouts rw
  JOIN weekday_counts wc ON wc.user_id = rw.user_id AND wc.workout_split_id = rw.workout_split_id
    AND wc.weekday = EXTRACT(DOW FROM rw.workout_start_utc) AND wc.rn = 1
), aggregated AS (
  SELECT f.user_id, f.workout_split_id, wc.weekday AS preferred_weekday, COUNT(*) AS total_cnt,
    FLOOR(AVG((EXTRACT(EPOCH FROM f.adjusted_time_utc)) % 86400))::int AS avg_seconds_in_day
  FROM filtered f
  JOIN weekday_counts wc ON wc.user_id = f.user_id AND wc.workout_split_id = f.workout_split_id
    AND wc.weekday = f.weekday AND wc.rn = 1
  GROUP BY f.user_id, f.workout_split_id, wc.weekday
), finalized AS (
  SELECT a.user_id, a.workout_split_id,
    DATE_TRUNC('day', timezone('UTC', now())) + make_interval(secs => a.avg_seconds_in_day) AS estimated_time_utc,
    a.preferred_weekday, a.total_cnt
  FROM aggregated a
)
INSERT INTO reminders.user_split_information
  (user_id, workout_split_id, estimated_time_utc, confidence, last_computed_at, preferred_weekday)
SELECT f.user_id, f.workout_split_id, f.estimated_time_utc,
  CASE WHEN f.total_cnt >= 3 THEN 1.00 WHEN f.total_cnt = 2 THEN 0.60 ELSE 0.30 END,
  timezone('UTC', now()), f.preferred_weekday
FROM finalized f
ON CONFLICT (user_id, workout_split_id) DO UPDATE
SET estimated_time_utc = EXCLUDED.estimated_time_utc,
  confidence = EXCLUDED.confidence,
  last_computed_at = EXCLUDED.last_computed_at,
  preferred_weekday = EXCLUDED.preferred_weekday;
$$;--> statement-breakpoint

-- Re-register the existing jobs with their original names and schedules.
DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'cron') THEN
    SELECT jobid INTO existing_job_id
    FROM cron.job
    WHERE jobname = 'compact_old_workouts_daily'
    ORDER BY jobid
    LIMIT 1;

    IF existing_job_id IS NOT NULL THEN
      PERFORM cron.unschedule(existing_job_id);
    END IF;

    PERFORM cron.schedule(
      'compact_old_workouts_daily',
      '10 0 * * *',
      'SELECT tracking.housekeeping_compact_old_workouts();'
    );

    existing_job_id := NULL;

    SELECT jobid INTO existing_job_id
    FROM cron.job
    WHERE jobname = 'refresh-user-split-information-daily'
    ORDER BY jobid
    LIMIT 1;

    IF existing_job_id IS NOT NULL THEN
      PERFORM cron.unschedule(existing_job_id);
    END IF;

    PERFORM cron.schedule(
      'refresh-user-split-information-daily',
      '0 2 * * *',
      'SELECT reminders.refresh_user_split_information();'
    );
  END IF;
END
$$;
