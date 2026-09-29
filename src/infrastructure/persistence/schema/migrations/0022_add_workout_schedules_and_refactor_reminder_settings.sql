CREATE SCHEMA "schedules";

--> statement-breakpoint
CREATE TABLE "schedules"."workout_schedule" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "user_id" UUID NOT NULL,
  "workout_split_id" BIGINT NOT NULL,
  "day_of_week" INTEGER NOT NULL,
  "start_time" TIME(0) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "workout_schedule_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workout_schedule_user_split_weekday_key" UNIQUE ("user_id", "workout_split_id", "day_of_week"),
  CONSTRAINT "workout_schedule_day_of_week_check" CHECK (
    "schedules"."workout_schedule"."day_of_week" BETWEEN 0 AND 6
  )
);

--> statement-breakpoint
ALTER TABLE "schedules"."workout_schedule" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
DO $block$
DECLARE reminder_job_id bigint;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'cron') THEN
    FOR reminder_job_id IN
      SELECT jobid FROM cron.job WHERE jobname = 'refresh-user-split-information-daily'
    LOOP
      PERFORM cron.unschedule(reminder_job_id);
    END LOOP;
  END IF;
END
$block$;

--> statement-breakpoint
DROP FUNCTION IF EXISTS "reminders"."refresh_user_split_information" ();

--> statement-breakpoint
DROP TABLE "reminders"."user_split_information" CASCADE;

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
RENAME COLUMN "workout_reminders_enabled" TO "reminder_enabled";

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
RENAME COLUMN "timezone" TO "time_zone";

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
ADD COLUMN "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL;

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;

--> statement-breakpoint
UPDATE "reminders"."user_reminder_setting"
SET
  "time_zone" = 'UTC'
WHERE
  "time_zone" IS NULL
  OR "time_zone" = '''UTC''::text';

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
ALTER COLUMN "time_zone"
SET NOT NULL;

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
ALTER COLUMN "time_zone"
DROP DEFAULT;

--> statement-breakpoint
ALTER TABLE "schedules"."workout_schedule"
ADD CONSTRAINT "workout_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "schedules"."workout_schedule"
ADD CONSTRAINT "workout_schedule_workout_split_id_fkey" FOREIGN KEY ("workout_split_id") REFERENCES "workout"."workout_split" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
DROP COLUMN "reminder_offset_minutes";

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
DROP CONSTRAINT "user_reminder_setting_pkey";

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
ADD CONSTRAINT "user_reminder_setting_pkey" PRIMARY KEY ("id");

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
ADD CONSTRAINT "user_reminder_setting_user_id_key" UNIQUE ("user_id");

--> statement-breakpoint
CREATE POLICY "auth can SELECT own workout schedules" ON "schedules"."workout_schedule" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "identity"."current_user_id" () = "schedules"."workout_schedule"."user_id"
  );

--> statement-breakpoint
CREATE POLICY "auth can INSERT own workout schedules" ON "schedules"."workout_schedule" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "identity"."current_user_id" () = "schedules"."workout_schedule"."user_id"
  );

--> statement-breakpoint
CREATE POLICY "auth can UPDATE own workout schedules" ON "schedules"."workout_schedule" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "identity"."current_user_id" () = "schedules"."workout_schedule"."user_id"
  )
WITH
  CHECK (
    "identity"."current_user_id" () = "schedules"."workout_schedule"."user_id"
  );

--> statement-breakpoint
CREATE POLICY "auth can DELETE own workout schedules" ON "schedules"."workout_schedule" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "identity"."current_user_id" () = "schedules"."workout_schedule"."user_id"
);

--> statement-breakpoint
GRANT USAGE ON SCHEMA "schedules" TO "authenticated";

--> statement-breakpoint
GRANT
SELECT
,
  INSERT,
UPDATE,
DELETE ON TABLE "schedules"."workout_schedule" TO "authenticated";

--> statement-breakpoint
CREATE OR REPLACE FUNCTION "guest_api"."create_app_user" (
  username_in TEXT,
  name_in TEXT,
  email_in TEXT,
  gender_in TEXT,
  password_in TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path = pg_catalog AS $function$
DECLARE created_user jsonb;
BEGIN
  INSERT INTO identity."user" (username, name, email, gender, password)
  VALUES (username_in, name_in, email_in, gender_in, password_in)
  RETURNING jsonb_build_object(
    'id', id, 'username', username, 'name', name, 'email', email,
    'gender', gender, 'role', role, 'created_at', created_at
  ) INTO created_user;

  RETURN created_user;
END;
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION "guest_api"."oauth_create_user" (
  provider_in TEXT,
  candidate_username_in TEXT,
  email_in TEXT,
  name_in TEXT,
  provider_user_id_in TEXT,
  provider_email_in TEXT
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path = pg_catalog AS $function$
DECLARE created_user_id uuid; chosen_username text; suffix integer := 0;
BEGIN
  IF candidate_username_in IS NULL THEN
    chosen_username := 'user_' || substr(md5(random()::text), 1, 6);
  ELSE
    chosen_username := lower(candidate_username_in);
    WHILE EXISTS (SELECT 1 FROM identity."user" WHERE username = chosen_username) LOOP
      suffix := suffix + 1;
      chosen_username := candidate_username_in || suffix::text;
    END LOOP;
  END IF;

  INSERT INTO identity."user" (username, email, name, gender, is_verified, auth_provider)
  VALUES (chosen_username, email_in, name_in, 'Unknown', true, provider_in)
  RETURNING id INTO created_user_id;

  INSERT INTO identity.oauth_account (user_id, provider, provider_user_id, provider_email)
  VALUES (created_user_id, provider_in, provider_user_id_in, provider_email_in);

  RETURN created_user_id;
END;
$function$;
