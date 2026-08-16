DROP VIEW "analytics"."v_exercisetracking_expanded";--> statement-breakpoint
DROP VIEW "analytics"."v_exercisetracking_set_simple";--> statement-breakpoint
DROP VIEW "analytics"."v_prs";--> statement-breakpoint
DROP VIEW "workout"."v_exercisetoworkoutsplit_expanded";--> statement-breakpoint
ALTER TABLE "identity"."user" RENAME COLUMN "profile_image_url" TO "profile_image_path";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" RENAME COLUMN "split_id" TO "workout_split_id";--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" RENAME COLUMN "exercisetosplit_id" TO "exercise_to_split_id";--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" RENAME COLUMN "workoutsplit_id" TO "workout_split_id";--> statement-breakpoint
ALTER TABLE "workout"."exercise" RENAME COLUMN "targetmuscle" TO "target_muscle";--> statement-breakpoint
ALTER TABLE "workout"."exercise" RENAME COLUMN "specifictargetmuscle" TO "specific_target_muscle";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" RENAME COLUMN "workoutsplit_id" TO "workout_split_id";--> statement-breakpoint
ALTER TABLE "workout"."workout_set" RENAME COLUMN "exercisetoworkoutsplit_id" TO "exercise_to_split_id";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" DROP CONSTRAINT "user_split_information_user_id_split_id_key";--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" DROP CONSTRAINT "uq_ets_split_exercise";--> statement-breakpoint
ALTER TABLE "workout"."workout_set" DROP CONSTRAINT "workout_set_exercise_order_unique";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" DROP CONSTRAINT "user_split_information_split_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" DROP CONSTRAINT "exercisetracking_exercisetosplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" DROP CONSTRAINT "workout_summary_workoutsplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" DROP CONSTRAINT "ExerciseToWorkoutsplit_workoutsplit_id_fkey";
--> statement-breakpoint
ALTER TABLE "workout"."workout_set" DROP CONSTRAINT "workout_set_exercisetoworkoutsplit_id_fkey";
--> statement-breakpoint
DROP INDEX "workout"."exercisetoworkoutsplit_active_idx";--> statement-breakpoint
DROP INDEX "workout"."exercisetoworkoutsplit_workoutsplit_id_order_index_idx";--> statement-breakpoint
DROP INDEX "workout"."workout_set_exercisetoworkoutsplit_id_idx";--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" ADD CONSTRAINT "user_split_information_split_id_fkey" FOREIGN KEY ("workout_split_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ADD CONSTRAINT "exercisetracking_exercisetosplit_id_fkey" FOREIGN KEY ("exercise_to_split_id") REFERENCES "workout"."exercise_to_workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking"."workout_summary" ADD CONSTRAINT "workout_summary_workoutsplit_id_fkey" FOREIGN KEY ("workout_split_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "ExerciseToWorkoutsplit_workoutsplit_id_fkey" FOREIGN KEY ("workout_split_id") REFERENCES "workout"."workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_set" ADD CONSTRAINT "workout_set_exercisetoworkoutsplit_id_fkey" FOREIGN KEY ("exercise_to_split_id") REFERENCES "workout"."exercise_to_workout_split"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "exercisetoworkoutsplit_active_idx" ON "workout"."exercise_to_workout_split" USING btree ("workout_split_id","order_index") WHERE "workout"."exercise_to_workout_split"."is_active" = true;--> statement-breakpoint
CREATE INDEX "exercisetoworkoutsplit_workoutsplit_id_order_index_idx" ON "workout"."exercise_to_workout_split" USING btree ("workout_split_id","order_index");--> statement-breakpoint
CREATE INDEX "workout_set_exercisetoworkoutsplit_id_idx" ON "workout"."workout_set" USING btree ("exercise_to_split_id");--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" ADD CONSTRAINT "user_split_information_user_id_split_id_key" UNIQUE("user_id","workout_split_id");--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ADD CONSTRAINT "uq_ets_split_exercise" UNIQUE("workout_split_id","exercise_id");--> statement-breakpoint
ALTER TABLE "workout"."workout_set" ADD CONSTRAINT "workout_set_exercise_order_unique" UNIQUE("exercise_to_split_id","order_index");--> statement-breakpoint
CREATE VIEW "analytics"."v_exercisetracking_expanded" WITH (security_invoker = true) AS (
    SELECT et.id,
      et.exercise_to_split_id,
      et.weight,
      et.reps,
      ews.exercise_id,
      wsumm.workout_split_id,
      ws.name AS splitname,
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
CREATE VIEW "analytics"."v_exercisetracking_set_simple" WITH (security_invoker = true) AS (
    SELECT et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      s.weight,
      s.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM analytics.v_exercisetracking_expanded et
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
    FROM analytics.v_exercisetracking_set_simple s
    WHERE s.weight IS NOT NULL AND s.reps IS NOT NULL
    ORDER BY s.exercise_id, s.weight DESC, s.reps DESC, s.workout_start_utc DESC, s.id DESC
  );--> statement-breakpoint
CREATE VIEW "workout"."v_exercisetoworkoutsplit_expanded" WITH (security_invoker = true) AS (
    SELECT ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workoutsplit,
      ews.sets,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM workout.exercise_to_workout_split ews
    JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
    JOIN workout.exercise ex ON ex.id = ews.exercise_id
  );--> statement-breakpoint
ALTER POLICY "Allow user to view senders in their messages" ON "identity"."user" TO authenticated USING (exists (select 1 from "messages"."message" m where m."sender_id" = "identity"."user"."id" and m."receiver_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on tracking_set" ON "tracking"."tracking_set" TO authenticated USING (exists (
    select 1
    from "tracking"."exercise_tracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on tracking_set" ON "tracking"."tracking_set" TO authenticated WITH CHECK (exists (
    select 1
    from "tracking"."exercise_tracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable update for auth users on tracking_set" ON "tracking"."tracking_set" TO authenticated USING (exists (
    select 1
    from "tracking"."exercise_tracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  )) WITH CHECK (exists (
    select 1
    from "tracking"."exercise_tracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on tracking_set" ON "tracking"."tracking_set" TO authenticated USING (exists (
    select 1
    from "tracking"."exercise_tracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workout_split_id"));--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workout_split_id"));--> statement-breakpoint
ALTER POLICY "Enable update for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workout_split_id")) WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = "workout"."exercise_to_workout_split"."workout_split_id"));--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on exercisetoworkoutsplit" ON "workout"."exercise_to_workout_split" TO authenticated USING (exists (select 1 from "workout"."workout_split" ws join "workout"."workout_plan" wp on wp."id" = ws."workout_id" where ws."id" = "workout"."exercise_to_workout_split"."workout_split_id" and wp."user_id" = "identity"."current_user_id"()));--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on workout_set" ON "workout"."workout_set" TO authenticated USING (exists (
    select 1
    from "workout"."exercise_to_workout_split" ets
    join "workout"."workout_split" ws on ws."id" = ets."workout_split_id"
    join "workout"."workout_plan" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercise_to_split_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on workout_set" ON "workout"."workout_set" TO authenticated WITH CHECK (exists (
    select 1
    from "workout"."exercise_to_workout_split" ets
    join "workout"."workout_split" ws on ws."id" = ets."workout_split_id"
    join "workout"."workout_plan" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercise_to_split_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable update for auth users on workout_set" ON "workout"."workout_set" TO authenticated USING (exists (
    select 1
    from "workout"."exercise_to_workout_split" ets
    join "workout"."workout_split" ws on ws."id" = ets."workout_split_id"
    join "workout"."workout_plan" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercise_to_split_id"
      and wp."user_id" = "identity"."current_user_id"()
  )) WITH CHECK (exists (
    select 1
    from "workout"."exercise_to_workout_split" ets
    join "workout"."workout_split" ws on ws."id" = ets."workout_split_id"
    join "workout"."workout_plan" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercise_to_split_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on workout_set" ON "workout"."workout_set" TO authenticated USING (exists (
    select 1
    from "workout"."exercise_to_workout_split" ets
    join "workout"."workout_split" ws on ws."id" = ets."workout_split_id"
    join "workout"."workout_plan" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercise_to_split_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
ALTER POLICY "Enable read access for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = "workout"."workout_split"."workout_id"));--> statement-breakpoint
ALTER POLICY "Enable insert for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = "workout"."workout_split"."workout_id"));--> statement-breakpoint
ALTER POLICY "Enable update for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated USING ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = "workout"."workout_split"."workout_id")) WITH CHECK ("identity"."current_user_id"() = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = "workout"."workout_split"."workout_id"));--> statement-breakpoint
ALTER POLICY "Enable delete for auth users on workoutsplits" ON "workout"."workout_split" TO authenticated USING (exists (select 1 from "workout"."workout_plan" wp where wp."id" = "workout"."workout_split"."workout_id" and wp."user_id" = "identity"."current_user_id"()));