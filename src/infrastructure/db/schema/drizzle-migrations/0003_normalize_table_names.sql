ALTER TABLE "identity"."oauth_accounts" RENAME TO "oauth_account";--> statement-breakpoint
ALTER TABLE "identity"."users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "messages"."messages" RENAME TO "message";--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_settings" RENAME TO "user_reminder_setting";--> statement-breakpoint
ALTER TABLE "tracking"."aerobictracking" RENAME TO "aerobic_tracking";--> statement-breakpoint
ALTER TABLE "tracking"."exercisetracking" RENAME TO "exercise_tracking";--> statement-breakpoint
ALTER TABLE "workout"."exercises" RENAME TO "exercise";--> statement-breakpoint
ALTER TABLE "workout"."exercisetoworkoutsplit" RENAME TO "exercise_to_workout_split";--> statement-breakpoint
ALTER TABLE "workout"."workoutplans" RENAME TO "workout_plan";--> statement-breakpoint
ALTER TABLE "workout"."workoutsplits" RENAME TO "workout_split";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" DROP CONSTRAINT "oauth_accounts_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "messages"."message" DROP CONSTRAINT "messages_sender_id_fkey";
--> statement-breakpoint
ALTER TABLE "messages"."message" DROP CONSTRAINT "messages_receiver_id_fkey";
--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" DROP CONSTRAINT "user_reminder_settings_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" DROP CONSTRAINT "user_split_information_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" DROP CONSTRAINT "user_split_information_split_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" DROP CONSTRAINT "aerobictracking_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" DROP CONSTRAINT "exercisetracking_exercisetosplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" DROP CONSTRAINT "exercisetracking_workout_summary_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."tracking_set" DROP CONSTRAINT "tracking_set_exercise_tracking_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" DROP CONSTRAINT "workout_summary_user_id_fkey";
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
DROP INDEX "workout"."exercisetoworkoutsplit_active_idx";--> statement-breakpoint
DROP INDEX "workout"."uq_workoutplans_active_user";--> statement-breakpoint
ALTER TABLE "identity"."oauth_account" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "messages"."message" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "messages"."message" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" ADD CONSTRAINT "user_reminder_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" ADD CONSTRAINT "user_split_information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" ADD CONSTRAINT "user_split_information_split_id_fkey" FOREIGN KEY ("split_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" ADD CONSTRAINT "aerobictracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ADD CONSTRAINT "exercisetracking_exercisetosplit_id_fkey" FOREIGN KEY ("exercisetosplit_id") REFERENCES "workout"."exercise_to_workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ADD CONSTRAINT "exercisetracking_workout_summary_id_fkey" FOREIGN KEY ("workout_summary_id") REFERENCES "tracking"."workout_summary"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."tracking_set" ADD CONSTRAINT "tracking_set_exercise_tracking_id_fkey" FOREIGN KEY ("exercise_tracking_id") REFERENCES "tracking"."exercise_tracking"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" ADD CONSTRAINT "workout_summary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" ADD CONSTRAINT "workout_summary_workoutsplit_id_fkey" FOREIGN KEY ("workoutsplit_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "ExerciseToWorkoutsplit_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "workout"."exercise"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "ExerciseToWorkoutsplit_workoutsplit_id_fkey" FOREIGN KEY ("workoutsplit_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_set" ADD CONSTRAINT "workout_set_exercisetoworkoutsplit_id_fkey" FOREIGN KEY ("exercisetoworkoutsplit_id") REFERENCES "workout"."exercise_to_workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" ADD CONSTRAINT "workoutplans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" ADD CONSTRAINT "workoutplans_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "identity"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_split" ADD CONSTRAINT "workoutsplits_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"."workout_plan"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_ci_unique" ON "identity"."user" USING btree (lower(trim(both from "email"))) WHERE "identity"."user"."email" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_ci_unique" ON "identity"."user" USING btree (lower(trim(both from "username"))) WHERE "identity"."user"."username" is not null;--> statement-breakpoint
CREATE INDEX "exercisetoworkoutsplit_active_idx" ON "workout"."exercise_to_workout_split" USING btree ("workoutsplit_id","order_index") WHERE "workout"."exercise_to_workout_split"."is_active" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_workoutplans_active_user" ON "workout"."workout_plan" USING btree ("user_id") WHERE "workout"."workout_plan"."is_active";--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on oauth_accounts" ON "identity"."oauth_account" TO authenticated USING ("identity"."current_user_id"() = "identity"."oauth_account"."user_id");--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on oauth_accounts" ON "identity"."oauth_account" TO authenticated WITH CHECK ("identity"."current_user_id"() = "identity"."oauth_account"."user_id");--> statement-breakpoint
ALTER POLICY "Enable update for auth users on oauth_accounts" ON "identity"."oauth_account" TO authenticated USING ("identity"."current_user_id"() = "identity"."oauth_account"."user_id") WITH CHECK ("identity"."current_user_id"() = "identity"."oauth_account"."user_id");--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on oauth_accounts" ON "identity"."oauth_account" TO authenticated USING ("identity"."current_user_id"() = "identity"."oauth_account"."user_id");--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on own profile" ON "identity"."user" TO authenticated USING ("identity"."current_user_id"() = "identity"."user"."id");--> statement-breakpoint
ALTER POLICY "Allow user to view senders in their messages" ON "identity"."user" TO authenticated USING (exists (select 1 from "messages"."messages" m where m."sender_id" = "identity"."user"."id" and m."receiver_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on own profile" ON "identity"."user" TO authenticated WITH CHECK ("identity"."current_user_id"() = "identity"."user"."id");--> statement-breakpoint
ALTER POLICY "Enable insert for public users on own profile" ON "identity"."user" TO public WITH CHECK ("identity"."current_user_id"() = "identity"."user"."id");--> statement-breakpoint
ALTER POLICY "Enable update for auth users on own profile" ON "identity"."user" TO authenticated USING ("identity"."current_user_id"() = "identity"."user"."id") WITH CHECK ("identity"."current_user_id"() = "identity"."user"."id");--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on own profile" ON "identity"."user" TO authenticated USING ("identity"."current_user_id"() = "identity"."user"."id");--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on messages" ON "messages"."message" TO authenticated USING ("identity"."current_user_id"() = "messages"."message"."sender_id" or "identity"."current_user_id"() = "messages"."message"."receiver_id");--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on messages" ON "messages"."message" TO authenticated WITH CHECK ("identity"."current_user_id"() = "messages"."message"."sender_id" or "messages"."message"."sender_id" = '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a'::uuid);--> statement-breakpoint
ALTER POLICY "Enable update for auth users on messages" ON "messages"."message" TO authenticated USING ("identity"."current_user_id"() = "messages"."message"."sender_id" or "identity"."current_user_id"() = "messages"."message"."receiver_id") WITH CHECK ("identity"."current_user_id"() = "messages"."message"."sender_id" or "identity"."current_user_id"() = "messages"."message"."receiver_id");--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on messages" ON "messages"."message" TO authenticated USING ("identity"."current_user_id"() = "messages"."message"."sender_id" or "identity"."current_user_id"() = "messages"."message"."receiver_id");--> statement-breakpoint
ALTER POLICY "auth can SELECT own reminder settings" ON "reminders"."user_reminder_setting" TO authenticated USING ("identity"."current_user_id"() = "reminders"."user_reminder_setting"."user_id");--> statement-breakpoint
ALTER POLICY "auth can INSERT own reminder settings" ON "reminders"."user_reminder_setting" TO authenticated WITH CHECK ("identity"."current_user_id"() = "reminders"."user_reminder_setting"."user_id");--> statement-breakpoint
ALTER POLICY "auth can UPDATE own reminder settings" ON "reminders"."user_reminder_setting" TO authenticated USING ("identity"."current_user_id"() = "reminders"."user_reminder_setting"."user_id") WITH CHECK ("identity"."current_user_id"() = "reminders"."user_reminder_setting"."user_id");--> statement-breakpoint
ALTER POLICY "Allow authenticated users to update their own reminder settings" ON "reminders"."user_reminder_setting" TO authenticated USING ("identity"."current_user_id"() = "reminders"."user_reminder_setting"."user_id");--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on aerobictracking" ON "tracking"."aerobic_tracking" TO authenticated USING ("identity"."current_user_id"() = "tracking"."aerobic_tracking"."user_id");--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on aerobictracking" ON "tracking"."aerobic_tracking" TO authenticated WITH CHECK ("identity"."current_user_id"() = "tracking"."aerobic_tracking"."user_id");--> statement-breakpoint
ALTER POLICY "Enable update for auth users on aerobictracking" ON "tracking"."aerobic_tracking" TO authenticated USING ("identity"."current_user_id"() = "tracking"."aerobic_tracking"."user_id") WITH CHECK ("identity"."current_user_id"() = "tracking"."aerobic_tracking"."user_id");--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on aerobictracking" ON "tracking"."aerobic_tracking" TO authenticated USING ("identity"."current_user_id"() = "tracking"."aerobic_tracking"."user_id");--> statement-breakpoint
ALTER POLICY "exercisetracking_select_by_summary_owner" ON "tracking"."exercise_tracking" TO authenticated USING (exists (select 1 from "tracking"."workout_summary" ws where ws."id" = "tracking"."exercise_tracking"."workout_summary_id" and ws."user_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "exercisetracking_insert_by_summary_owner" ON "tracking"."exercise_tracking" TO authenticated WITH CHECK (exists (select 1 from "tracking"."workout_summary" ws where ws."id" = "tracking"."exercise_tracking"."workout_summary_id" and ws."user_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "exercisetracking_update_by_summary_owner" ON "tracking"."exercise_tracking" TO authenticated USING (exists (select 1 from "tracking"."workout_summary" ws where ws."id" = "tracking"."exercise_tracking"."workout_summary_id" and ws."user_id" = "identity"."current_user_id"())) WITH CHECK (exists (select 1 from "tracking"."workout_summary" ws where ws."id" = "tracking"."exercise_tracking"."workout_summary_id" and ws."user_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "exercisetracking_delete_by_summary_owner" ON "tracking"."exercise_tracking" TO authenticated USING (exists (select 1 from "tracking"."workout_summary" ws where ws."id" = "tracking"."exercise_tracking"."workout_summary_id" and ws."user_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp join "workout"."workoutsplits" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workoutsplit_id"));--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp join "workout"."workoutsplits" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workoutsplit_id"));--> statement-breakpoint
ALTER POLICY "Enable update for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp join "workout"."workoutsplits" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workoutsplit_id")) WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp join "workout"."workoutsplits" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workoutsplit_id"));--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated USING (exists (select 1 from "workout"."workoutsplits" ws join "workout"."workoutplans" wp on wp."id" = ws."workout_id" where ws."id" = "workout"."exercise_to_workout_split"."workoutsplit_id" and wp."user_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on workoutplans" ON "workout"."workout_plan" TO authenticated USING ("identity"."current_user_id"() = "workout"."workout_plan"."user_id");--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on workoutplans" ON "workout"."workout_plan" TO authenticated WITH CHECK ("identity"."current_user_id"() = "workout"."workout_plan"."user_id");--> statement-breakpoint
ALTER POLICY "Enable update for auth users on workoutplans" ON "workout"."workout_plan" TO authenticated USING ("identity"."current_user_id"() = "workout"."workout_plan"."user_id") WITH CHECK ("identity"."current_user_id"() = "workout"."workout_plan"."user_id");--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on workoutplans" ON "workout"."workout_plan" TO authenticated USING ("identity"."current_user_id"() = "workout"."workout_plan"."user_id");--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp where wp."id" = "workout"."workout_split"."workout_id"));--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp where wp."id" = "workout"."workout_split"."workout_id"));--> statement-breakpoint
ALTER POLICY "Enable update for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp where wp."id" = "workout"."workout_split"."workout_id")) WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workoutplans" wp where wp."id" = "workout"."workout_split"."workout_id"));--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated USING (exists (select 1 from "workout"."workoutplans" wp where wp."id" = "workout"."workout_split"."workout_id" and wp."user_id" = "identity"."current_user_id"()));