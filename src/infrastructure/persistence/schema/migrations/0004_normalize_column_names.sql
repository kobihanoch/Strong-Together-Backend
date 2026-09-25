ALTER TABLE "identity"."user" RENAME COLUMN "profile_image_url" TO "profile_image_path";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" RENAME COLUMN "split_id" TO "workout_split_id";--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" RENAME COLUMN "exercisetosplit_id" TO "exercise_to_split_id";--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" RENAME COLUMN "workoutsplit_id" TO "workout_split_id";--> statement-breakpoint
ALTER TABLE "workout"."exercise" RENAME COLUMN "targetmuscle" TO "target_muscle";--> statement-breakpoint
ALTER TABLE "workout"."exercise" RENAME COLUMN "specifictargetmuscle" TO "specific_target_muscle";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" RENAME COLUMN "workoutsplit_id" TO "workout_split_id";--> statement-breakpoint
ALTER TABLE "workout"."workout_set" RENAME COLUMN "exercisetoworkoutsplit_id" TO "exercise_to_split_id";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercisetracking_expanded" RENAME COLUMN "exercisetosplit_id" TO "exercise_to_split_id";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercisetracking_expanded" RENAME COLUMN "workoutsplit_id" TO "workout_split_id";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercisetracking_set_simple" RENAME COLUMN "exercisetosplit_id" TO "exercise_to_split_id";--> statement-breakpoint
ALTER VIEW "analytics"."v_prs" RENAME COLUMN "exercisetosplit_id" TO "exercise_to_split_id";--> statement-breakpoint
ALTER VIEW "workout"."v_exercisetoworkoutsplit_expanded" RENAME COLUMN "workoutsplit_id" TO "workout_split_id";
