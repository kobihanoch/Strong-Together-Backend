GRANT USAGE ON SCHEMA "cron_api" TO "guest";
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "cron_api"."due_workout_reminders"() TO "guest";
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "cron_api"."valid_workout_reminder_token"(UUID, UUID, DATE) TO "guest";
