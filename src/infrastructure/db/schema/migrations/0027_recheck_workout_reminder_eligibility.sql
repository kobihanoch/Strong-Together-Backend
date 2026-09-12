DROP FUNCTION "cron_api"."valid_workout_reminder_token"(UUID);

--> statement-breakpoint
CREATE FUNCTION "cron_api"."valid_workout_reminder_token"(
  user_id_in UUID,
  workout_schedule_id_in UUID,
  occurrence_date_in DATE
)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT users.push_token
  FROM identity."user" users
  JOIN reminders.user_reminder_setting settings
    ON settings.user_id = users.id
  JOIN schedules.workout_schedule schedule
    ON schedule.id = workout_schedule_id_in
   AND schedule.user_id = users.id
  JOIN workout.workout_split split
    ON split.id = schedule.workout_split_id
   AND split.is_active = TRUE
  JOIN workout.workout_plan plan
    ON plan.id = split.workout_id
   AND plan.user_id = users.id
   AND plan.is_active = TRUE
  WHERE users.id = user_id_in
    AND users.push_token IS NOT NULL
    AND settings.reminder_enabled = TRUE
    AND EXTRACT(DOW FROM occurrence_date_in) = schedule.day_of_week
  LIMIT 1;
$function$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "cron_api"."valid_workout_reminder_token"(UUID, UUID, DATE) FROM PUBLIC;

--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "cron_api"."valid_workout_reminder_token"(UUID, UUID, DATE) TO "app_runtime_user";
