ALTER TABLE IF EXISTS "public"."workout_summary" SET SCHEMA "tracking";
ALTER TABLE IF EXISTS "public"."exercisetracking" SET SCHEMA "tracking";
ALTER TABLE IF EXISTS "public"."aerobictracking" SET SCHEMA "tracking";

ALTER SEQUENCE IF EXISTS "public"."exercisetracking_id_seq" SET SCHEMA "tracking";
ALTER SEQUENCE IF EXISTS "public"."aerobictracking_id_seq" SET SCHEMA "tracking";

DROP FUNCTION IF EXISTS "public"."housekeeping_compact_old_workouts"();

CREATE OR REPLACE FUNCTION "tracking"."housekeeping_compact_old_workouts"() RETURNS "void"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
WITH
today_utc AS (
  SELECT (now() AT TIME ZONE 'UTC')::date AS d
),
days AS (
  SELECT
    ws.user_id,
    (ws.workout_start_utc AT TIME ZONE 'UTC')::date AS d
  FROM tracking.exercisetracking et
  JOIN tracking.workout_summary ws
    ON ws.id = et.workout_summary_id
  GROUP BY ws.user_id, d
),
ranked_days AS (
  SELECT
    user_id,
    d,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d DESC) AS day_rank
  FROM days
),
old_days AS (
  SELECT rd.user_id, rd.d
  FROM ranked_days rd
  CROSS JOIN today_utc t
  WHERE rd.day_rank > 35
    AND rd.d < (t.d - INTERVAL '45 days')
)
DELETE FROM tracking.exercisetracking et
USING tracking.workout_summary ws, old_days od
WHERE et.workout_summary_id = ws.id
  AND ws.user_id = od.user_id
  AND (ws.workout_start_utc AT TIME ZONE 'UTC')::date = od.d;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'cron') THEN
    PERFORM cron.schedule(
      'compact_old_workouts_daily',
      '10 0 * * *',
      'SELECT tracking.housekeeping_compact_old_workouts();'
    );
  END IF;
END
$$;

COMMENT ON SCHEMA "tracking" IS 'Completed workout, exercise tracking, and aerobic tracking data';
