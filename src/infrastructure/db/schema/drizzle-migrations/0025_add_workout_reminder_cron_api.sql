CREATE SCHEMA IF NOT EXISTS "cron_api";
REVOKE ALL ON SCHEMA "cron_api" FROM PUBLIC;
GRANT USAGE ON SCHEMA "cron_api" TO "app_runtime_user";
--> statement-breakpoint

ALTER TABLE "reminders"."user_reminder_setting"
DROP COLUMN "reminder_offset_minutes";
--> statement-breakpoint

CREATE FUNCTION "cron_api"."due_workout_reminders"()
RETURNS TABLE (
  user_id uuid,
  workout_schedule_id uuid,
  occurrence_date date,
  reminder_at timestamptz,
  first_name text,
  split_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  WITH candidates AS (
    SELECT
      users.id AS user_id,
      schedule.id AS workout_schedule_id,
      dates.workout_date::date AS occurrence_date,
      (
        dates.workout_date::date
        + schedule.start_time
        - interval '30 minutes'
      ) AT TIME ZONE settings.time_zone AS reminder_at,
      split_part(users.name, ' ', 1) AS first_name,
      split.name AS split_name
    FROM identity."user" users
    JOIN reminders.user_reminder_setting settings ON settings.user_id = users.id
    JOIN schedules.workout_schedule schedule ON schedule.user_id = users.id
    JOIN workout.workout_split split ON split.id = schedule.workout_split_id
    CROSS JOIN LATERAL (
      VALUES
        ((now() AT TIME ZONE settings.time_zone)::date),
        ((now() AT TIME ZONE settings.time_zone)::date + 1)
    ) AS dates(workout_date)
    WHERE settings.reminder_enabled = true
      AND extract(dow FROM dates.workout_date) = schedule.day_of_week
  )
  SELECT *
  FROM candidates
  WHERE reminder_at >= now()
    AND reminder_at < now() + interval '70 minutes'
  ORDER BY reminder_at, workout_schedule_id;
$function$;
--> statement-breakpoint

CREATE FUNCTION "cron_api"."valid_workout_reminder_token"(
  user_id_in uuid
)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT users.push_token
  FROM identity."user" users
  WHERE users.id = user_id_in
    AND users.push_token IS NOT NULL
  LIMIT 1;
$function$;
--> statement-breakpoint

REVOKE ALL ON FUNCTION "cron_api"."due_workout_reminders"() FROM PUBLIC;
REVOKE ALL ON FUNCTION "cron_api"."valid_workout_reminder_token"(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "cron_api"."due_workout_reminders"() TO "app_runtime_user";
GRANT EXECUTE ON FUNCTION "cron_api"."valid_workout_reminder_token"(uuid) TO "app_runtime_user";
