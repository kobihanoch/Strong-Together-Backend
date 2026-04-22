CREATE POLICY "Allow all authenticated users to read exercises" ON "workout"."exercises" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Allow authenticated users to update their own reminder settings" ON "reminders"."user_reminder_settings" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Allow user to view senders in their messages" ON "identity"."users" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "messages"."messages" "m"
  WHERE (("m"."sender_id" = "users"."id") AND ("m"."receiver_id" = "identity"."current_user_id"())))));

CREATE POLICY "Enable delete for auth users on aerobictracking" ON "tracking"."aerobictracking" FOR DELETE TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable delete for auth users on exercisetoworkoutsplit" ON "workout"."exercisetoworkoutsplit" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("workout"."workoutsplits"
     JOIN "workout"."workoutplans" ON (("workoutplans"."id" = "workoutsplits"."workout_id")))
  WHERE (("workoutsplits"."id" = "exercisetoworkoutsplit"."workoutsplit_id") AND ("workoutplans"."user_id" = "identity"."current_user_id"())))));

CREATE POLICY "Enable delete for auth users on messages" ON "messages"."messages" FOR DELETE TO "authenticated" USING ((("identity"."current_user_id"() = "sender_id") OR ("identity"."current_user_id"() = "receiver_id")));

CREATE POLICY "Enable delete for auth users on oauth_accounts" ON "identity"."oauth_accounts" FOR DELETE TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable delete for auth users on own profile" ON "identity"."users" FOR DELETE TO "authenticated" USING (("identity"."current_user_id"() = "id"));

CREATE POLICY "Enable delete for auth users on workoutplans" ON "workout"."workoutplans" FOR DELETE TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable delete for auth users on workoutsplits" ON "workout"."workoutsplits" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "workout"."workoutplans"
  WHERE (("workoutplans"."id" = "workoutsplits"."workout_id") AND ("workoutplans"."user_id" = "identity"."current_user_id"())))));

CREATE POLICY "Enable insert for auth users on aerobictracking" ON "tracking"."aerobictracking" FOR INSERT TO "authenticated" WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable insert for auth users on exercisetoworkoutsplit" ON "workout"."exercisetoworkoutsplit" FOR INSERT TO "authenticated" WITH CHECK (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM ("workout"."workoutplans" "wp"
     JOIN "workout"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));

CREATE POLICY "Enable insert for auth users on messages" ON "messages"."messages" FOR INSERT TO "authenticated" WITH CHECK ((("identity"."current_user_id"() = "sender_id") OR ("sender_id" = '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a'::"uuid")));

CREATE POLICY "Enable insert for auth users on oauth_accounts" ON "identity"."oauth_accounts" FOR INSERT TO "authenticated" WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable insert for auth users on own profile" ON "identity"."users" FOR INSERT TO "authenticated" WITH CHECK (("identity"."current_user_id"() = "id"));

CREATE POLICY "Enable insert for auth users on workoutplans" ON "workout"."workoutplans" FOR INSERT TO "authenticated" WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable insert for auth users on workoutsplits" ON "workout"."workoutsplits" FOR INSERT TO "authenticated" WITH CHECK (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM "workout"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));

CREATE POLICY "Enable insert for public users on own profile" ON "identity"."users" FOR INSERT WITH CHECK (("identity"."current_user_id"() = "id"));

CREATE POLICY "Enable read access for auth users on aerobictracking" ON "tracking"."aerobictracking" FOR SELECT TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable read access for auth users on exercisetoworkoutsplit" ON "workout"."exercisetoworkoutsplit" FOR SELECT TO "authenticated" USING (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM ("workout"."workoutplans" "wp"
     JOIN "workout"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));

CREATE POLICY "Enable read access for auth users on messages" ON "messages"."messages" FOR SELECT TO "authenticated" USING ((("identity"."current_user_id"() = "sender_id") OR ("identity"."current_user_id"() = "receiver_id")));

CREATE POLICY "Enable read access for auth users on oauth_accounts" ON "identity"."oauth_accounts" FOR SELECT TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable read access for auth users on own profile" ON "identity"."users" FOR SELECT TO "authenticated" USING (("identity"."current_user_id"() = "id"));

CREATE POLICY "Enable read access for auth users on workoutplans" ON "workout"."workoutplans" FOR SELECT TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable read access for auth users on workoutsplits" ON "workout"."workoutsplits" FOR SELECT TO "authenticated" USING (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM "workout"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));

CREATE POLICY "Enable update for auth users on aerobictracking" ON "tracking"."aerobictracking" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = "user_id")) WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable update for auth users on exercisetoworkoutsplit" ON "workout"."exercisetoworkoutsplit" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM ("workout"."workoutplans" "wp"
     JOIN "workout"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id")))) WITH CHECK (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM ("workout"."workoutplans" "wp"
     JOIN "workout"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));

CREATE POLICY "Enable update for auth users on messages" ON "messages"."messages" FOR UPDATE TO "authenticated" USING ((("identity"."current_user_id"() = "sender_id") OR ("identity"."current_user_id"() = "receiver_id"))) WITH CHECK ((("identity"."current_user_id"() = "sender_id") OR ("identity"."current_user_id"() = "receiver_id")));

CREATE POLICY "Enable update for auth users on oauth_accounts" ON "identity"."oauth_accounts" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = "user_id")) WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable update for auth users on own profile" ON "identity"."users" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = "id")) WITH CHECK (("identity"."current_user_id"() = "id"));

CREATE POLICY "Enable update for auth users on workoutplans" ON "workout"."workoutplans" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = "user_id")) WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "Enable update for auth users on workoutsplits" ON "workout"."workoutsplits" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM "workout"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id")))) WITH CHECK (("identity"."current_user_id"() = ( SELECT "wp"."user_id"
   FROM "workout"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));

CREATE POLICY "auth can INSERT own reminder settings" ON "reminders"."user_reminder_settings" FOR INSERT TO "authenticated" WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "auth can SELECT own reminder settings" ON "reminders"."user_reminder_settings" FOR SELECT TO "authenticated" USING (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "auth can UPDATE own reminder settings" ON "reminders"."user_reminder_settings" FOR UPDATE TO "authenticated" USING (("identity"."current_user_id"() = "user_id")) WITH CHECK (("identity"."current_user_id"() = "user_id"));

CREATE POLICY "exercisetracking_delete_by_summary_owner" ON "tracking"."exercisetracking" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "tracking"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "identity"."current_user_id"())))));

CREATE POLICY "exercisetracking_insert_by_summary_owner" ON "tracking"."exercisetracking" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "tracking"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "identity"."current_user_id"())))));

CREATE POLICY "exercisetracking_select_by_summary_owner" ON "tracking"."exercisetracking" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "tracking"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "identity"."current_user_id"())))));

CREATE POLICY "exercisetracking_update_by_summary_owner" ON "tracking"."exercisetracking" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "tracking"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "identity"."current_user_id"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "tracking"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "identity"."current_user_id"())))));

CREATE POLICY "users can delete their workout summaries" ON "tracking"."workout_summary" FOR DELETE TO "authenticated" USING (("user_id" = "identity"."current_user_id"()));

CREATE POLICY "users can insert their workout summaries" ON "tracking"."workout_summary" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "identity"."current_user_id"()));

CREATE POLICY "users can read their workout summaries" ON "tracking"."workout_summary" FOR SELECT TO "authenticated" USING (("user_id" = "identity"."current_user_id"()));

CREATE POLICY "users can update their workout summaries" ON "tracking"."workout_summary" FOR UPDATE TO "authenticated" USING (("user_id" = "identity"."current_user_id"())) WITH CHECK (("user_id" = "identity"."current_user_id"()));

GRANT USAGE ON SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "authenticated";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "authenticated";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "authenticated";
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "authenticated";

GRANT USAGE ON SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "service_role", "app_user";
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE ON ALL TABLES IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "service_role";
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE ON ALL TABLES IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "app_user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "app_user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "service_role";
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" TO "service_role", "app_user";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages" GRANT ALL ON FUNCTIONS TO "authenticated";

DROP FUNCTION IF EXISTS "app"."current_user_id"();
DROP SCHEMA IF EXISTS "app";

