ALTER TABLE "identity"."oauth_accounts" RENAME TO "oauth_account";--> statement-breakpoint
ALTER TABLE "identity"."users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "messages"."messages" RENAME TO "message";--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_settings" RENAME TO "user_reminder_setting";--> statement-breakpoint
ALTER TABLE "tracking"."aerobictracking" RENAME TO "aerobic_tracking";--> statement-breakpoint
ALTER TABLE "tracking"."exercisetracking" RENAME TO "exercise_tracking";--> statement-breakpoint
ALTER TABLE "workout"."exercises" RENAME TO "exercise";--> statement-breakpoint
ALTER TABLE "workout"."exercisetoworkoutsplit" RENAME TO "exercise_to_workout_split";--> statement-breakpoint
ALTER TABLE "workout"."workoutplans" RENAME TO "workout_plan";--> statement-breakpoint
ALTER TABLE "workout"."workoutsplits" RENAME TO "workout_split";
