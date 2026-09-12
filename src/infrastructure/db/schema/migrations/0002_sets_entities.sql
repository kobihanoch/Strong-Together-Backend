CREATE TABLE "tracking"."tracking_set" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"exercise_tracking_id" bigint NOT NULL,
	"set_index" integer NOT NULL,
	"reps" integer NOT NULL,
	"weight" real NOT NULL,
	CONSTRAINT "tracking_set_pkey" PRIMARY KEY("id"),
	CONSTRAINT "tracking_set_exercise_index_unique" UNIQUE("exercise_tracking_id","set_index")
);
--> statement-breakpoint
ALTER TABLE "tracking"."tracking_set" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workout"."workout_set" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"exercisetoworkoutsplit_id" bigint NOT NULL,
	"order_index" integer NOT NULL,
	"reps" integer NOT NULL,
	CONSTRAINT "workout_set_pkey" PRIMARY KEY("id"),
	CONSTRAINT "workout_set_exercise_order_unique" UNIQUE("exercisetoworkoutsplit_id","order_index")
);
--> statement-breakpoint
ALTER TABLE "workout"."workout_set" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tracking"."tracking_set" ADD CONSTRAINT "tracking_set_exercise_tracking_id_fkey" FOREIGN KEY ("exercise_tracking_id") REFERENCES "tracking"."exercisetracking"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workout"."workout_set" ADD CONSTRAINT "workout_set_exercisetoworkoutsplit_id_fkey" FOREIGN KEY ("exercisetoworkoutsplit_id") REFERENCES "workout"."exercisetoworkoutsplit"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "tracking_set_exercise_tracking_id_idx" ON "tracking"."tracking_set" USING btree ("exercise_tracking_id");--> statement-breakpoint
CREATE INDEX "workout_set_exercisetoworkoutsplit_id_idx" ON "workout"."workout_set" USING btree ("exercisetoworkoutsplit_id");--> statement-breakpoint
CREATE POLICY "Enable read access for auth users on tracking_set" ON "tracking"."tracking_set" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
    select 1
    from "tracking"."exercisetracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
CREATE POLICY "Enable insert for auth users on tracking_set" ON "tracking"."tracking_set" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
    select 1
    from "tracking"."exercisetracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
CREATE POLICY "Enable update for auth users on tracking_set" ON "tracking"."tracking_set" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
    select 1
    from "tracking"."exercisetracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  )) WITH CHECK (exists (
    select 1
    from "tracking"."exercisetracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
CREATE POLICY "Enable delete for auth users on tracking_set" ON "tracking"."tracking_set" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
    select 1
    from "tracking"."exercisetracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = "tracking"."tracking_set"."exercise_tracking_id"
      and ws."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
CREATE POLICY "Enable read access for auth users on workout_set" ON "workout"."workout_set" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
    select 1
    from "workout"."exercisetoworkoutsplit" ets
    join "workout"."workoutsplits" ws on ws."id" = ets."workoutsplit_id"
    join "workout"."workoutplans" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercisetoworkoutsplit_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
CREATE POLICY "Enable insert for auth users on workout_set" ON "workout"."workout_set" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
    select 1
    from "workout"."exercisetoworkoutsplit" ets
    join "workout"."workoutsplits" ws on ws."id" = ets."workoutsplit_id"
    join "workout"."workoutplans" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercisetoworkoutsplit_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
CREATE POLICY "Enable update for auth users on workout_set" ON "workout"."workout_set" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
    select 1
    from "workout"."exercisetoworkoutsplit" ets
    join "workout"."workoutsplits" ws on ws."id" = ets."workoutsplit_id"
    join "workout"."workoutplans" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercisetoworkoutsplit_id"
      and wp."user_id" = "identity"."current_user_id"()
  )) WITH CHECK (exists (
    select 1
    from "workout"."exercisetoworkoutsplit" ets
    join "workout"."workoutsplits" ws on ws."id" = ets."workoutsplit_id"
    join "workout"."workoutplans" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercisetoworkoutsplit_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));--> statement-breakpoint
CREATE POLICY "Enable delete for auth users on workout_set" ON "workout"."workout_set" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
    select 1
    from "workout"."exercisetoworkoutsplit" ets
    join "workout"."workoutsplits" ws on ws."id" = ets."workoutsplit_id"
    join "workout"."workoutplans" wp on wp."id" = ws."workout_id"
    where ets."id" = "workout"."workout_set"."exercisetoworkoutsplit_id"
      and wp."user_id" = "identity"."current_user_id"()
  ));