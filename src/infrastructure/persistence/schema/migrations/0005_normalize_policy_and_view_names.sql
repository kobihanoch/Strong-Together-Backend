ALTER VIEW "analytics"."v_exercisetracking_expanded" RENAME TO "v_exercise_tracking_expanded";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercisetracking_set_simple" RENAME TO "v_exercise_tracking_set_simple";--> statement-breakpoint
ALTER VIEW "workout"."v_exercisetoworkoutsplit_expanded" RENAME TO "v_exercise_to_workout_split_expanded";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercise_tracking_expanded" RENAME COLUMN "splitname" TO "split_name";--> statement-breakpoint
ALTER VIEW "workout"."v_exercise_to_workout_split_expanded" RENAME COLUMN "workoutsplit" TO "workout_split";--> statement-breakpoint

DROP SEQUENCE "reminders"."user_split_information_id_seq";--> statement-breakpoint
ALTER SEQUENCE "reminders"."user_split_information_id_seq1" RENAME TO "user_split_information_id_seq";--> statement-breakpoint
ALTER SEQUENCE "tracking"."aerobictracking_id_seq" RENAME TO "aerobic_tracking_id_seq";--> statement-breakpoint
ALTER SEQUENCE "tracking"."exercisetracking_id_seq" RENAME TO "exercise_tracking_id_seq";--> statement-breakpoint
ALTER SEQUENCE "workout"."exercises_id_seq" RENAME TO "exercise_id_seq";--> statement-breakpoint
ALTER SEQUENCE "workout"."ExerciseToWorkoutsplit_id_seq" RENAME TO "exercise_to_workout_split_id_seq";--> statement-breakpoint
ALTER SEQUENCE "workout"."workoutplan_id_seq" RENAME TO "workout_plan_id_seq";--> statement-breakpoint
ALTER SEQUENCE "workout"."workoutsplits_id_seq" RENAME TO "workout_split_id_seq";--> statement-breakpoint

ALTER TABLE "identity"."oauth_account" RENAME CONSTRAINT "oauth_accounts_pkey" TO "oauth_account_pkey";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" RENAME CONSTRAINT "oauth_accounts_provider_user_unique" TO "oauth_account_provider_user_unique";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" RENAME CONSTRAINT "oauth_accounts_user_id_fkey" TO "oauth_account_user_id_fkey";--> statement-breakpoint
ALTER TABLE "identity"."user" RENAME CONSTRAINT "users_pkey" TO "user_pkey";--> statement-breakpoint
ALTER TABLE "identity"."user" RENAME CONSTRAINT "users_id_key1" TO "user_id_key";--> statement-breakpoint
ALTER TABLE "messages"."message" RENAME CONSTRAINT "messages_pkey" TO "message_pkey";--> statement-breakpoint
ALTER TABLE "messages"."message" RENAME CONSTRAINT "messages_sender_id_fkey" TO "message_sender_id_fkey";--> statement-breakpoint
ALTER TABLE "messages"."message" RENAME CONSTRAINT "messages_receiver_id_fkey" TO "message_receiver_id_fkey";--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" RENAME CONSTRAINT "user_reminder_settings_pkey" TO "user_reminder_setting_pkey";--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" RENAME CONSTRAINT "user_reminder_settings_user_id_fkey" TO "user_reminder_setting_user_id_fkey";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" RENAME CONSTRAINT "user_split_information_user_id_split_id_key" TO "user_split_information_user_id_workout_split_id_key";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" RENAME CONSTRAINT "user_split_information_split_id_fkey" TO "user_split_information_workout_split_id_fkey";--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" RENAME CONSTRAINT "aerobictracking_pkey" TO "aerobic_tracking_pkey";--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" RENAME CONSTRAINT "aerobictracking_user_id_fkey" TO "aerobic_tracking_user_id_fkey";--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" RENAME CONSTRAINT "exercisetracking_pkey" TO "exercise_tracking_pkey";--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" RENAME CONSTRAINT "exercisetracking_exercisetosplit_id_fkey" TO "exercise_tracking_exercise_to_split_id_fkey";--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" RENAME CONSTRAINT "exercisetracking_workout_summary_id_fkey" TO "exercise_tracking_workout_summary_id_fkey";--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" RENAME CONSTRAINT "workout_summary_workoutsplit_id_fkey" TO "workout_summary_workout_split_id_fkey";--> statement-breakpoint
ALTER TABLE "workout"."exercise" RENAME CONSTRAINT "exercises_pkey" TO "exercise_pkey";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" RENAME CONSTRAINT "ExerciseToWorkoutsplit_pkey" TO "exercise_to_workout_split_pkey";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" RENAME CONSTRAINT "uq_ets_split_exercise" TO "uq_exercise_to_workout_split_workout_split_exercise";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" RENAME CONSTRAINT "ExerciseToWorkoutsplit_exercise_id_fkey" TO "exercise_to_workout_split_exercise_id_fkey";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" RENAME CONSTRAINT "ExerciseToWorkoutsplit_workoutsplit_id_fkey" TO "exercise_to_workout_split_workout_split_id_fkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_set" RENAME CONSTRAINT "workout_set_exercisetoworkoutsplit_id_fkey" TO "workout_set_exercise_to_split_id_fkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" RENAME CONSTRAINT "workoutplan_pkey" TO "workout_plan_pkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" RENAME CONSTRAINT "workoutplans_user_id_fkey" TO "workout_plan_user_id_fkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" RENAME CONSTRAINT "workoutplans_trainer_id_fkey" TO "workout_plan_trainer_id_fkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_split" RENAME CONSTRAINT "workoutsplits_pkey" TO "workout_split_pkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_split" RENAME CONSTRAINT "uq_workoutsplits_plan_name" TO "uq_workout_split_plan_name";--> statement-breakpoint
ALTER TABLE "workout"."workout_split" RENAME CONSTRAINT "workoutsplits_workout_id_fkey" TO "workout_split_workout_id_fkey";--> statement-breakpoint

ALTER INDEX "identity"."users_email_ci_unique" RENAME TO "user_email_ci_unique";--> statement-breakpoint
ALTER INDEX "identity"."users_username_ci_unique" RENAME TO "user_username_ci_unique";--> statement-breakpoint
ALTER INDEX "messages"."messages_receiver_id_idx" RENAME TO "message_receiver_id_idx";--> statement-breakpoint
ALTER INDEX "tracking"."aerobictracking_user_id_workout_time_utc_idx" RENAME TO "aerobic_tracking_user_id_workout_time_utc_idx";--> statement-breakpoint
ALTER INDEX "tracking"."exercisetracking_workout_summary_id_idx" RENAME TO "exercise_tracking_workout_summary_id_idx";--> statement-breakpoint
ALTER INDEX "workout"."exercises_name_unique" RENAME TO "exercise_name_unique";--> statement-breakpoint
ALTER INDEX "workout"."exercisetoworkoutsplit_active_idx" RENAME TO "exercise_to_workout_split_active_idx";--> statement-breakpoint
ALTER INDEX "workout"."exercisetoworkoutsplit_workoutsplit_id_order_index_idx" RENAME TO "exercise_to_workout_split_workout_split_id_order_index_idx";--> statement-breakpoint
ALTER INDEX "workout"."workout_set_exercisetoworkoutsplit_id_idx" RENAME TO "workout_set_exercise_to_split_id_idx";--> statement-breakpoint
ALTER INDEX "workout"."uq_workoutplans_active_user" RENAME TO "uq_workout_plan_active_user";--> statement-breakpoint
ALTER INDEX "workout"."workoutsplits_workout_id_idx" RENAME TO "workout_split_workout_id_idx";--> statement-breakpoint

ALTER POLICY "Enable read access for auth users on oauth_accounts" ON "identity"."oauth_account" RENAME TO "Enable read access for auth users on oauth_account";--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on oauth_accounts" ON "identity"."oauth_account" RENAME TO "Enable insert for auth users on oauth_account";--> statement-breakpoint
ALTER POLICY "Enable update for auth users on oauth_accounts" ON "identity"."oauth_account" RENAME TO "Enable update for auth users on oauth_account";--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on oauth_accounts" ON "identity"."oauth_account" RENAME TO "Enable delete for auth users on oauth_account";--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on messages" ON "messages"."message" RENAME TO "Enable read access for auth users on message";--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on messages" ON "messages"."message" RENAME TO "Enable insert for auth users on message";--> statement-breakpoint
ALTER POLICY "Enable update for auth users on messages" ON "messages"."message" RENAME TO "Enable update for auth users on message";--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on messages" ON "messages"."message" RENAME TO "Enable delete for auth users on message";--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on aerobictracking" ON "tracking"."aerobic_tracking" RENAME TO "Enable read access for auth users on aerobic_tracking";--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on aerobictracking" ON "tracking"."aerobic_tracking" RENAME TO "Enable insert for auth users on aerobic_tracking";--> statement-breakpoint
ALTER POLICY "Enable update for auth users on aerobictracking" ON "tracking"."aerobic_tracking" RENAME TO "Enable update for auth users on aerobic_tracking";--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on aerobictracking" ON "tracking"."aerobic_tracking" RENAME TO "Enable delete for auth users on aerobic_tracking";--> statement-breakpoint
ALTER POLICY "exercisetracking_select_by_summary_owner" ON "tracking"."exercise_tracking" RENAME TO "exercise_tracking_select_by_summary_owner";--> statement-breakpoint
ALTER POLICY "exercisetracking_insert_by_summary_owner" ON "tracking"."exercise_tracking" RENAME TO "exercise_tracking_insert_by_summary_owner";--> statement-breakpoint
ALTER POLICY "exercisetracking_update_by_summary_owner" ON "tracking"."exercise_tracking" RENAME TO "exercise_tracking_update_by_summary_owner";--> statement-breakpoint
ALTER POLICY "exercisetracking_delete_by_summary_owner" ON "tracking"."exercise_tracking" RENAME TO "exercise_tracking_delete_by_summary_owner";--> statement-breakpoint
ALTER POLICY "Allow all authenticated users to read exercises" ON "workout"."exercise" RENAME TO "Allow all authenticated users to read exercise";--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" RENAME TO "Enable read access for auth users on exercise_to_workout_split";--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" RENAME TO "Enable insert for auth users on exercise_to_workout_split";--> statement-breakpoint
ALTER POLICY "Enable update for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" RENAME TO "Enable update for auth users on exercise_to_workout_split";--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" RENAME TO "Enable delete for auth users on exercise_to_workout_split";--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on workoutplans" ON "workout"."workout_plan" RENAME TO "Enable read access for auth users on workout_plan";--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on workoutplans" ON "workout"."workout_plan" RENAME TO "Enable insert for auth users on workout_plan";--> statement-breakpoint
ALTER POLICY "Enable update for auth users on workoutplans" ON "workout"."workout_plan" RENAME TO "Enable update for auth users on workout_plan";--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on workoutplans" ON "workout"."workout_plan" RENAME TO "Enable delete for auth users on workout_plan";--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on workoutsplits" ON "workout"."workout_split" RENAME TO "Enable read access for auth users on workout_split";--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on workoutsplits" ON "workout"."workout_split" RENAME TO "Enable insert for auth users on workout_split";--> statement-breakpoint
ALTER POLICY "Enable update for auth users on workoutsplits" ON "workout"."workout_split" RENAME TO "Enable update for auth users on workout_split";--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on workoutsplits" ON "workout"."workout_split" RENAME TO "Enable delete for auth users on workout_split";
