DROP VIEW "analytics"."v_exercise_tracking_expanded";--> statement-breakpoint
DROP VIEW "analytics"."v_exercise_tracking_set_simple";--> statement-breakpoint
DROP VIEW "analytics"."v_prs";--> statement-breakpoint
DROP VIEW "workout"."v_exercise_to_workout_split_expanded";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercisetracking_expanded" RENAME TO "v_exercise_tracking_expanded";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercisetracking_set_simple" RENAME TO "v_exercise_tracking_set_simple";--> statement-breakpoint
ALTER VIEW "workout"."v_exercisetoworkoutsplit_expanded" RENAME TO "v_exercise_to_workout_split_expanded";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" DROP CONSTRAINT "oauth_accounts_provider_user_unique";--> statement-breakpoint
ALTER TABLE "identity"."user" DROP CONSTRAINT "users_id_key1";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" DROP CONSTRAINT "user_split_information_user_id_split_id_key";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" DROP CONSTRAINT "uq_ets_split_exercise";--> statement-breakpoint
ALTER TABLE "workout"."workout_split" DROP CONSTRAINT "uq_workoutsplits_plan_name";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" DROP CONSTRAINT "oauth_accounts_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "messages"."message" DROP CONSTRAINT "messages_sender_id_fkey";
--> statement-breakpoint
ALTER TABLE "messages"."message" DROP CONSTRAINT "messages_receiver_id_fkey";
--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" DROP CONSTRAINT "user_reminder_settings_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" DROP CONSTRAINT "user_split_information_split_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" DROP CONSTRAINT "aerobictracking_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" DROP CONSTRAINT "exercisetracking_exercisetosplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" DROP CONSTRAINT "exercisetracking_workout_summary_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" DROP CONSTRAINT "workout_summary_workoutsplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" DROP CONSTRAINT "ExerciseToWorkoutsplit_exercise_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" DROP CONSTRAINT "ExerciseToWorkoutsplit_workoutsplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."workout_set" DROP CONSTRAINT "workout_set_exercisetoworkoutsplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" DROP CONSTRAINT "workoutplans_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" DROP CONSTRAINT "workoutplans_trainer_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."workout_split" DROP CONSTRAINT "workoutsplits_workout_id_fkey";
--> statement-breakpoint
DROP INDEX "identity"."users_email_ci_unique";--> statement-breakpoint
DROP INDEX "identity"."users_username_ci_unique";--> statement-breakpoint
DROP INDEX "messages"."messages_receiver_id_idx";--> statement-breakpoint
DROP INDEX "tracking"."aerobictracking_user_id_workout_time_utc_idx";--> statement-breakpoint
DROP INDEX "tracking"."exercisetracking_workout_summary_id_idx";--> statement-breakpoint
DROP INDEX "workout"."exercises_name_unique";--> statement-breakpoint
DROP INDEX "workout"."exercisetoworkoutsplit_active_idx";--> statement-breakpoint
DROP INDEX "workout"."exercisetoworkoutsplit_workoutsplit_id_order_index_idx";--> statement-breakpoint
DROP INDEX "workout"."workout_set_exercisetoworkoutsplit_id_idx";--> statement-breakpoint
DROP INDEX "workout"."uq_workoutplans_active_user";--> statement-breakpoint
DROP INDEX "workout"."workoutsplits_workout_id_idx";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" DROP CONSTRAINT "oauth_accounts_pkey";--> statement-breakpoint
ALTER TABLE "identity"."user" DROP CONSTRAINT "users_pkey";--> statement-breakpoint
ALTER TABLE "messages"."message" DROP CONSTRAINT "messages_pkey";--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" DROP CONSTRAINT "user_reminder_settings_pkey";--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" DROP CONSTRAINT "aerobictracking_pkey";--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" DROP CONSTRAINT "exercisetracking_pkey";--> statement-breakpoint
ALTER TABLE "workout"."exercise" DROP CONSTRAINT "exercises_pkey";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" DROP CONSTRAINT "ExerciseToWorkoutsplit_pkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" DROP CONSTRAINT "workoutplan_pkey";--> statement-breakpoint
ALTER TABLE "workout"."workout_split" DROP CONSTRAINT "workoutsplits_pkey";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" ADD CONSTRAINT "oauth_account_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "identity"."user" ADD CONSTRAINT "user_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "messages"."message" ADD CONSTRAINT "message_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" ADD CONSTRAINT "user_reminder_setting_pkey" PRIMARY KEY("user_id");--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" ADD CONSTRAINT "aerobic_tracking_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ADD CONSTRAINT "exercise_tracking_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "workout"."exercise" ADD CONSTRAINT "exercise_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "exercise_to_workout_split_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" ADD CONSTRAINT "workout_plan_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "workout"."workout_split" ADD CONSTRAINT "workout_split_pkey" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" ADD CONSTRAINT "oauth_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "messages"."message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "messages"."message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" ADD CONSTRAINT "user_reminder_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" ADD CONSTRAINT "user_split_information_workout_split_id_fkey" FOREIGN KEY ("workout_split_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" ADD CONSTRAINT "aerobic_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ADD CONSTRAINT "exercise_tracking_exercise_to_split_id_fkey" FOREIGN KEY ("exercise_to_split_id") REFERENCES "workout"."exercise_to_workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ADD CONSTRAINT "exercise_tracking_workout_summary_id_fkey" FOREIGN KEY ("workout_summary_id") REFERENCES "tracking"."workout_summary"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" ADD CONSTRAINT "workout_summary_workout_split_id_fkey" FOREIGN KEY ("workout_split_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "exercise_to_workout_split_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "workout"."exercise"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "exercise_to_workout_split_workout_split_id_fkey" FOREIGN KEY ("workout_split_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_set" ADD CONSTRAINT "workout_set_exercise_to_split_id_fkey" FOREIGN KEY ("exercise_to_split_id") REFERENCES "workout"."exercise_to_workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" ADD CONSTRAINT "workout_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" ADD CONSTRAINT "workout_plan_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_split" ADD CONSTRAINT "workout_split_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"."workout_plan"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_ci_unique" ON "identity"."user" USING btree (lower(trim(both from "email"))) WHERE "identity"."user"."email" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_ci_unique" ON "identity"."user" USING btree (lower(trim(both from "username"))) WHERE "identity"."user"."username" is not null;--> statement-breakpoint
CREATE INDEX "message_receiver_id_idx" ON "messages"."message" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "aerobic_tracking_user_id_workout_time_utc_idx" ON "tracking"."aerobic_tracking" USING btree ("user_id","workout_time_utc" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "exercise_tracking_workout_summary_id_idx" ON "tracking"."exercise_tracking" USING btree ("workout_summary_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_name_unique" ON "workout"."exercise" USING btree ("name");--> statement-breakpoint
CREATE INDEX "exercise_to_workout_split_active_idx" ON "workout"."exercise_to_workout_split" USING btree ("workout_split_id","order_index") WHERE "workout"."exercise_to_workout_split"."is_active" = true;--> statement-breakpoint
CREATE INDEX "exercise_to_workout_split_workout_split_id_order_index_idx" ON "workout"."exercise_to_workout_split" USING btree ("workout_split_id","order_index");--> statement-breakpoint
CREATE INDEX "workout_set_exercise_to_split_id_idx" ON "workout"."workout_set" USING btree ("exercise_to_split_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_workout_plan_active_user" ON "workout"."workout_plan" USING btree ("user_id") WHERE "workout"."workout_plan"."is_active";--> statement-breakpoint
CREATE INDEX "workout_split_workout_id_idx" ON "workout"."workout_split" USING btree ("workout_id");--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" ADD CONSTRAINT "oauth_account_provider_user_unique" UNIQUE("provider","provider_user_id");--> statement-breakpoint
ALTER TABLE "identity"."user" ADD CONSTRAINT "user_id_key" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" ADD CONSTRAINT "user_split_information_user_id_workout_split_id_key" UNIQUE("user_id","workout_split_id");--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "uq_exercise_to_workout_split_workout_split_exercise" UNIQUE("workout_split_id","exercise_id");--> statement-breakpoint
ALTER TABLE "workout"."workout_split" ADD CONSTRAINT "uq_workout_split_plan_name" UNIQUE("workout_id","name");--> statement-breakpoint
CREATE VIEW "analytics"."v_exercise_tracking_expanded" WITH (security_invoker = true) AS (
    SELECT et.id,
      et.exercise_to_split_id,
      et.weight,
      et.reps,
      ews.exercise_id,
      wsumm.workout_split_id,
      ws.name AS split_name,
      ex.name AS exercise,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc
    FROM tracking.exercise_tracking et
    LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
    LEFT JOIN workout.exercise_to_workout_split ews ON ews.id = et.exercise_to_split_id
    LEFT JOIN workout.workout_split ws ON ws.id = wsumm.workout_split_id
    LEFT JOIN workout.exercise ex ON ex.id = ews.exercise_id
  );--> statement-breakpoint
CREATE VIEW "analytics"."v_exercise_tracking_set_simple" WITH (security_invoker = true) AS (
    SELECT et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      s.weight,
      s.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM analytics.v_exercise_tracking_expanded et
    CROSS JOIN LATERAL UNNEST(et.weight, et.reps) s(weight, reps)
  );--> statement-breakpoint
CREATE VIEW "analytics"."v_prs" WITH (security_invoker = true) AS (
    SELECT DISTINCT ON (s.exercise_id)
      s.id,
      s.exercise_to_split_id,
      s.exercise_id,
      s.exercise,
      s.weight,
      s.reps,
      s.workout_summary_id,
      s.workout_start_utc,
      s.workout_end_utc
    FROM analytics.v_exercise_tracking_set_simple s
    WHERE s.weight IS NOT NULL AND s.reps IS NOT NULL
    ORDER BY s.exercise_id, s.weight DESC, s.reps DESC, s.workout_start_utc DESC, s.id DESC
  );--> statement-breakpoint
CREATE VIEW "workout"."v_exercise_to_workout_split_expanded" WITH (security_invoker = true) AS (
    SELECT ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workout_split,
      ews.sets,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM workout.exercise_to_workout_split ews
    JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
    JOIN workout.exercise ex ON ex.id = ews.exercise_id
  );--> statement-breakpoint
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