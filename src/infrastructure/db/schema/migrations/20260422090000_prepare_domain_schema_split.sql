-- Prepare cross-schema dependencies before moving domain objects.
-- Existing migration files are intentionally left untouched.

CREATE SCHEMA IF NOT EXISTS "identity";
CREATE SCHEMA IF NOT EXISTS "workout";
CREATE SCHEMA IF NOT EXISTS "tracking";
CREATE SCHEMA IF NOT EXISTS "reminders";
CREATE SCHEMA IF NOT EXISTS "analytics";
CREATE SCHEMA IF NOT EXISTS "messages";

CREATE OR REPLACE FUNCTION "identity"."current_user_id"()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.current_user_id', true), '')::uuid
$$;

DROP VIEW IF EXISTS "public"."v_prs";
DROP VIEW IF EXISTS "public"."v_exercisetracking_set_simple";
DROP VIEW IF EXISTS "public"."v_exercisetracking_expanded";
DROP VIEW IF EXISTS "public"."v_exercisetoworkoutsplit_expanded";

DROP TRIGGER IF EXISTS "update_muscle_group_trigger" ON "public"."exercisetoworkoutsplit";

DO $$
DECLARE
  compact_old_workouts_daily_id bigint;
  refresh_user_split_information_daily_id bigint;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'cron') THEN
    SELECT jobid
    INTO compact_old_workouts_daily_id
    FROM cron.job
    WHERE jobname = 'compact_old_workouts_daily';

    IF compact_old_workouts_daily_id IS NOT NULL THEN
      PERFORM cron.unschedule(compact_old_workouts_daily_id);
    END IF;

    SELECT jobid
    INTO refresh_user_split_information_daily_id
    FROM cron.job
    WHERE jobname = 'refresh-user-split-information-daily';

    IF refresh_user_split_information_daily_id IS NOT NULL THEN
      PERFORM cron.unschedule(refresh_user_split_information_daily_id);
    END IF;
  END IF;
END
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

