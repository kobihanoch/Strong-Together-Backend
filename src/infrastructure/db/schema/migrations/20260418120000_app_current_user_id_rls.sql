CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.current_user_id', true), '')::uuid
$$;

DROP POLICY IF EXISTS "Allow all authenticated users to read exercises" ON "public"."exercises";
DROP POLICY IF EXISTS "Allow authenticated users to update their own reminder settings" ON "public"."user_reminder_settings";
DROP POLICY IF EXISTS "Allow user to view senders in their messages" ON "public"."users";
DROP POLICY IF EXISTS "Enable delete for auth users on aerobictracking" ON "public"."aerobictracking";
DROP POLICY IF EXISTS "Enable delete for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit";
DROP POLICY IF EXISTS "Enable delete for auth users on messages" ON "public"."messages";
DROP POLICY IF EXISTS "Enable delete for auth users on oauth_accounts" ON "public"."oauth_accounts";
DROP POLICY IF EXISTS "Enable delete for auth users on own profile" ON "public"."users";
DROP POLICY IF EXISTS "Enable delete for auth users on workoutplans" ON "public"."workoutplans";
DROP POLICY IF EXISTS "Enable delete for auth users on workoutsplits" ON "public"."workoutsplits";
DROP POLICY IF EXISTS "Enable insert for auth users on aerobictracking" ON "public"."aerobictracking";
DROP POLICY IF EXISTS "Enable insert for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit";
DROP POLICY IF EXISTS "Enable insert for auth users on messages" ON "public"."messages";
DROP POLICY IF EXISTS "Enable insert for auth users on oauth_accounts" ON "public"."oauth_accounts";
DROP POLICY IF EXISTS "Enable insert for auth users on own profile" ON "public"."users";
DROP POLICY IF EXISTS "Enable insert for auth users on workoutplans" ON "public"."workoutplans";
DROP POLICY IF EXISTS "Enable insert for auth users on workoutsplits" ON "public"."workoutsplits";
DROP POLICY IF EXISTS "Enable insert for public users on own profile" ON "public"."users";
DROP POLICY IF EXISTS "Enable read access for auth users on aerobictracking" ON "public"."aerobictracking";
DROP POLICY IF EXISTS "Enable read access for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit";
DROP POLICY IF EXISTS "Enable read access for auth users on messages" ON "public"."messages";
DROP POLICY IF EXISTS "Enable read access for auth users on oauth_accounts" ON "public"."oauth_accounts";
DROP POLICY IF EXISTS "Enable read access for auth users on own profile" ON "public"."users";
DROP POLICY IF EXISTS "Enable read access for auth users on workoutplans" ON "public"."workoutplans";
DROP POLICY IF EXISTS "Enable read access for auth users on workoutsplits" ON "public"."workoutsplits";
DROP POLICY IF EXISTS "Enable update for auth users on aerobictracking" ON "public"."aerobictracking";
DROP POLICY IF EXISTS "Enable update for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit";
DROP POLICY IF EXISTS "Enable update for auth users on messages" ON "public"."messages";
DROP POLICY IF EXISTS "Enable update for auth users on oauth_accounts" ON "public"."oauth_accounts";
DROP POLICY IF EXISTS "Enable update for auth users on own profile" ON "public"."users";
DROP POLICY IF EXISTS "Enable update for auth users on workoutplans" ON "public"."workoutplans";
DROP POLICY IF EXISTS "Enable update for auth users on workoutsplits" ON "public"."workoutsplits";
DROP POLICY IF EXISTS "auth can INSERT own reminder settings" ON "public"."user_reminder_settings";
DROP POLICY IF EXISTS "auth can SELECT own reminder settings" ON "public"."user_reminder_settings";
DROP POLICY IF EXISTS "auth can UPDATE own reminder settings" ON "public"."user_reminder_settings";
DROP POLICY IF EXISTS "exercisetracking_delete_by_summary_owner" ON "public"."exercisetracking";
DROP POLICY IF EXISTS "exercisetracking_insert_by_summary_owner" ON "public"."exercisetracking";
DROP POLICY IF EXISTS "exercisetracking_select_by_summary_owner" ON "public"."exercisetracking";
DROP POLICY IF EXISTS "exercisetracking_update_by_summary_owner" ON "public"."exercisetracking";
DROP POLICY IF EXISTS "users can delete their workout summaries" ON "public"."workout_summary";
DROP POLICY IF EXISTS "users can insert their workout summaries" ON "public"."workout_summary";
DROP POLICY IF EXISTS "users can read their workout summaries" ON "public"."workout_summary";
DROP POLICY IF EXISTS "users can update their workout summaries" ON "public"."workout_summary";

CREATE POLICY "Allow all authenticated users to read exercises" ON "public"."exercises" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Allow authenticated users to update their own reminder settings" ON "public"."user_reminder_settings" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "Allow user to view senders in their messages" ON "public"."users" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."messages" "m"
  WHERE (("m"."sender_id" = "users"."id") AND ("m"."receiver_id" = app.current_user_id())))));

CREATE POLICY "Enable delete for auth users on aerobictracking" ON "public"."aerobictracking" FOR DELETE TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable delete for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."workoutsplits"
     JOIN "public"."workoutplans" ON (("workoutplans"."id" = "workoutsplits"."workout_id")))
  WHERE (("workoutsplits"."id" = "exercisetoworkoutsplit"."workoutsplit_id") AND ("workoutplans"."user_id" = app.current_user_id())))));

CREATE POLICY "Enable delete for auth users on messages" ON "public"."messages" FOR DELETE TO "authenticated" USING (((app.current_user_id() = "sender_id") OR (app.current_user_id() = "receiver_id")));

CREATE POLICY "Enable delete for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR DELETE TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable delete for auth users on own profile" ON "public"."users" FOR DELETE TO "authenticated" USING ((app.current_user_id() = "id"));

CREATE POLICY "Enable delete for auth users on workoutplans" ON "public"."workoutplans" FOR DELETE TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable delete for auth users on workoutsplits" ON "public"."workoutsplits" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workoutplans"
  WHERE (("workoutplans"."id" = "workoutsplits"."workout_id") AND ("workoutplans"."user_id" = app.current_user_id())))));

CREATE POLICY "Enable insert for auth users on aerobictracking" ON "public"."aerobictracking" FOR INSERT TO "authenticated" WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable insert for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR INSERT TO "authenticated" WITH CHECK ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));

CREATE POLICY "Enable insert for auth users on messages" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (((app.current_user_id() = "sender_id") OR ("sender_id" = '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a'::"uuid")));

CREATE POLICY "Enable insert for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR INSERT TO "authenticated" WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable insert for auth users on own profile" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK ((app.current_user_id() = "id"));

CREATE POLICY "Enable insert for auth users on workoutplans" ON "public"."workoutplans" FOR INSERT TO "authenticated" WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable insert for auth users on workoutsplits" ON "public"."workoutsplits" FOR INSERT TO "authenticated" WITH CHECK ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));

CREATE POLICY "Enable insert for public users on own profile" ON "public"."users" FOR INSERT WITH CHECK ((app.current_user_id() = "id"));

CREATE POLICY "Enable read access for auth users on aerobictracking" ON "public"."aerobictracking" FOR SELECT TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable read access for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR SELECT TO "authenticated" USING ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));

CREATE POLICY "Enable read access for auth users on messages" ON "public"."messages" FOR SELECT TO "authenticated" USING (((app.current_user_id() = "sender_id") OR (app.current_user_id() = "receiver_id")));

CREATE POLICY "Enable read access for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR SELECT TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable read access for auth users on own profile" ON "public"."users" FOR SELECT TO "authenticated" USING ((app.current_user_id() = "id"));

CREATE POLICY "Enable read access for auth users on workoutplans" ON "public"."workoutplans" FOR SELECT TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable read access for auth users on workoutsplits" ON "public"."workoutsplits" FOR SELECT TO "authenticated" USING ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));

CREATE POLICY "Enable update for auth users on aerobictracking" ON "public"."aerobictracking" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = "user_id")) WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable update for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id")))) WITH CHECK ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));

CREATE POLICY "Enable update for auth users on messages" ON "public"."messages" FOR UPDATE TO "authenticated" USING (((app.current_user_id() = "sender_id") OR (app.current_user_id() = "receiver_id"))) WITH CHECK (((app.current_user_id() = "sender_id") OR (app.current_user_id() = "receiver_id")));

CREATE POLICY "Enable update for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = "user_id")) WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable update for auth users on own profile" ON "public"."users" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = "id")) WITH CHECK ((app.current_user_id() = "id"));

CREATE POLICY "Enable update for auth users on workoutplans" ON "public"."workoutplans" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = "user_id")) WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "Enable update for auth users on workoutsplits" ON "public"."workoutsplits" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id")))) WITH CHECK ((app.current_user_id() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));

CREATE POLICY "auth can INSERT own reminder settings" ON "public"."user_reminder_settings" FOR INSERT TO "authenticated" WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "auth can SELECT own reminder settings" ON "public"."user_reminder_settings" FOR SELECT TO "authenticated" USING ((app.current_user_id() = "user_id"));

CREATE POLICY "auth can UPDATE own reminder settings" ON "public"."user_reminder_settings" FOR UPDATE TO "authenticated" USING ((app.current_user_id() = "user_id")) WITH CHECK ((app.current_user_id() = "user_id"));

CREATE POLICY "exercisetracking_delete_by_summary_owner" ON "public"."exercisetracking" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = app.current_user_id())))));

CREATE POLICY "exercisetracking_insert_by_summary_owner" ON "public"."exercisetracking" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = app.current_user_id())))));

CREATE POLICY "exercisetracking_select_by_summary_owner" ON "public"."exercisetracking" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = app.current_user_id())))));

CREATE POLICY "exercisetracking_update_by_summary_owner" ON "public"."exercisetracking" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = app.current_user_id()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = app.current_user_id())))));

CREATE POLICY "users can delete their workout summaries" ON "public"."workout_summary" FOR DELETE TO "authenticated" USING (("user_id" = app.current_user_id()));

CREATE POLICY "users can insert their workout summaries" ON "public"."workout_summary" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = app.current_user_id()));

CREATE POLICY "users can read their workout summaries" ON "public"."workout_summary" FOR SELECT TO "authenticated" USING (("user_id" = app.current_user_id()));

CREATE POLICY "users can update their workout summaries" ON "public"."workout_summary" FOR UPDATE TO "authenticated" USING (("user_id" = app.current_user_id())) WITH CHECK (("user_id" = app.current_user_id()));
