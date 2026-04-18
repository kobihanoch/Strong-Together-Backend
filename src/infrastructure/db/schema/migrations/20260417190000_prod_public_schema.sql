


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user NOLOGIN;
  END IF;
END
$$;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."Auth Providers" AS ENUM (
    'apple',
    'google',
    'app'
);


ALTER TYPE "public"."Auth Providers" OWNER TO "postgres";


COMMENT ON TYPE "public"."Auth Providers" IS 'All auth providers available';



CREATE OR REPLACE FUNCTION "public"."housekeeping_compact_old_workouts"() RETURNS "void"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$-- English comments only inside the code
WITH
today_utc AS (
  SELECT (now() AT TIME ZONE 'UTC')::date AS d
),
days AS (
  SELECT
    ws.user_id,  -- was: et.user_id
    (ws.workout_start_utc AT TIME ZONE 'UTC')::date AS d
  FROM public.exercisetracking et
  JOIN public.workout_summary ws
    ON ws.id = et.workout_summary_id
  GROUP BY ws.user_id, d
),
ranked_days AS (
  SELECT
    user_id,
    d,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d DESC) AS day_rank
  FROM days
),
old_days AS (
  SELECT rd.user_id, rd.d
  FROM ranked_days rd
  CROSS JOIN today_utc t
  WHERE rd.day_rank > 35                 -- keep only 35 most recent workout-days per user
    AND rd.d < (t.d - INTERVAL '45 days') -- and also exclude very recent window
)
DELETE FROM public.exercisetracking et
USING public.workout_summary ws, old_days od
WHERE et.workout_summary_id = ws.id
  AND ws.user_id = od.user_id        -- was: et.user_id
  AND (ws.workout_start_utc AT TIME ZONE 'UTC')::date = od.d;$$;


ALTER FUNCTION "public"."housekeeping_compact_old_workouts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_owner_of_workoutsplit"("split_id_in" bigint) RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workoutsplits s
    JOIN public.workoutplans p ON p.id = s.workout_id
    WHERE s.id = split_id_in
    AND p.user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."is_owner_of_workoutsplit"("split_id_in" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_user_split_information"() RETURNS "void"
    LANGUAGE "sql"
    AS $$-- English comments only inside the code
WITH recent_workouts AS (
  SELECT
    ws.user_id,
    ws.workoutsplit_id AS split_id,
    ws.workout_end_utc,
    ws.workout_start_utc
  FROM public.exercisetracking et
  JOIN public.workout_summary ws
    ON ws.id = et.workout_summary_id
  WHERE
    -- take only workouts from the last 21 days
    ws.workout_start_utc >= timezone('UTC', now()) - INTERVAL '21 days'
    -- we only care about workouts that were actually attached to a split
    AND ws.workoutsplit_id IS NOT NULL
),
weekday_counts AS (
  SELECT
    rw.user_id,
    rw.split_id,
    EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone) AS weekday,
    COUNT(*) AS cnt,
    ROW_NUMBER() OVER (
      PARTITION BY rw.user_id, rw.split_id
      ORDER BY COUNT(*) DESC
    ) AS rn
  FROM recent_workouts rw
  join public.user_reminder_settings urs on urs.user_id = rw.user_id
  GROUP BY rw.user_id, rw.split_id, EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone)
),
filtered AS (
  SELECT
    rw.user_id,
    rw.split_id,
    rw.workout_start_utc AS adjusted_time_utc,
    EXTRACT(DOW FROM rw.workout_start_utc) AS weekday
  FROM recent_workouts rw
  JOIN weekday_counts wc
    ON wc.user_id = rw.user_id
   AND wc.split_id = rw.split_id
   AND wc.weekday = EXTRACT(DOW FROM rw.workout_start_utc)
   AND wc.rn = 1
),
aggregated AS (
  SELECT
    f.user_id,
    f.split_id,
    wc.weekday AS preferred_weekday,
    COUNT(*) AS total_cnt,
    FLOOR(
      AVG( (EXTRACT(EPOCH FROM f.adjusted_time_utc)) % 86400 )
    )::int AS avg_seconds_in_day
  FROM filtered f
  JOIN weekday_counts wc
    ON wc.user_id = f.user_id
   AND wc.split_id = f.split_id
   AND wc.weekday = f.weekday
   AND wc.rn = 1
  GROUP BY f.user_id, f.split_id, wc.weekday
),
finalized AS (
  SELECT
    a.user_id,
    a.split_id,
    (
      DATE_TRUNC('day', timezone('UTC', now()))
      + make_interval(secs => a.avg_seconds_in_day)
    ) AS estimated_time_utc,
    a.preferred_weekday,
    a.total_cnt
  FROM aggregated a
)
INSERT INTO public.user_split_information (
  user_id,
  split_id,
  estimated_time_utc,
  confidence,
  last_computed_at,
  preferred_weekday
)
SELECT
  f.user_id,
  f.split_id,
  f.estimated_time_utc,
  CASE
    WHEN f.total_cnt >= 3 THEN 1.00
    WHEN f.total_cnt = 2 THEN 0.60
    ELSE 0.30
  END AS confidence,
  timezone('UTC', now()) AS last_computed_at,
  f.preferred_weekday
FROM finalized f
ON CONFLICT (user_id, split_id)
DO UPDATE
  SET estimated_time_utc = EXCLUDED.estimated_time_utc,
      confidence = EXCLUDED.confidence,
      last_computed_at = EXCLUDED.last_computed_at,
      preferred_weekday = EXCLUDED.preferred_weekday;$$;


ALTER FUNCTION "public"."refresh_user_split_information"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_muscle_group_trigger_function"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Always recompute muscle_group for the affected split
  UPDATE public.workoutsplits AS ws
  SET muscle_group = (
    SELECT STRING_AGG(t.targetmuscle || ' (' || t.specifics || ')', ', ')
    FROM (
      SELECT
        e.targetmuscle,
        STRING_AGG(DISTINCT e.specifictargetmuscle, ', ' ORDER BY e.specifictargetmuscle) AS specifics
      FROM public.exercisetoworkoutsplit AS ew
      JOIN public.exercises AS e ON e.id = ew.exercise_id
      WHERE ew.workoutsplit_id = COALESCE(NEW.workoutsplit_id, OLD.workoutsplit_id)
        AND ew.is_active = TRUE -- Only count active exercises!
        AND e.targetmuscle IS NOT NULL
      GROUP BY e.targetmuscle
    ) AS t
  )
  WHERE ws.id = COALESCE(NEW.workoutsplit_id, OLD.workoutsplit_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."update_muscle_group_trigger_function"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."exercisetoworkoutsplit" (
    "id" bigint NOT NULL,
    "exercise_id" bigint NOT NULL,
    "workoutsplit_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sets" bigint[] NOT NULL,
    "order_index" bigint NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."exercisetoworkoutsplit" OWNER TO "postgres";


ALTER TABLE "public"."exercisetoworkoutsplit" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ExerciseToWorkoutsplit_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."aerobictracking" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "duration_mins" bigint DEFAULT '0'::bigint NOT NULL,
    "duration_sec" bigint DEFAULT '0'::bigint NOT NULL,
    "workout_time_utc" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);


ALTER TABLE "public"."aerobictracking" OWNER TO "postgres";


COMMENT ON TABLE "public"."aerobictracking" IS 'All aerobic trackings';



ALTER TABLE "public"."aerobictracking" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."aerobictracking_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "targetmuscle" "text" NOT NULL,
    "specifictargetmuscle" "text" NOT NULL
);


ALTER TABLE "public"."exercises" OWNER TO "postgres";


COMMENT ON TABLE "public"."exercises" IS 'All exercises';



ALTER TABLE "public"."exercises" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."exercises_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."exercisetracking" (
    "id" bigint NOT NULL,
    "exercisetosplit_id" bigint NOT NULL,
    "weight" real[] NOT NULL,
    "reps" bigint[] NOT NULL,
    "notes" "text",
    "workout_summary_id" "uuid" NOT NULL
);


ALTER TABLE "public"."exercisetracking" OWNER TO "postgres";


COMMENT ON TABLE "public"."exercisetracking" IS 'Exercise tracking';



ALTER TABLE "public"."exercisetracking" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."exercisetracking_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sender_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "receiver_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "subject" "text" DEFAULT 'Subject'::"text" NOT NULL,
    "msg" "text" DEFAULT 'Hello World'::"text" NOT NULL,
    "sent_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY "public"."messages" REPLICA IDENTITY FULL;


ALTER TABLE "public"."messages" OWNER TO "postgres";


COMMENT ON TABLE "public"."messages" IS 'All messages inside app - user to user, app to user etc..';



CREATE TABLE IF NOT EXISTS "public"."oauth_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "provider" "text" NOT NULL,
    "provider_user_id" "text" NOT NULL,
    "provider_email" "text" NOT NULL,
    "linked_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "missing_fields" "text"
);


ALTER TABLE "public"."oauth_accounts" OWNER TO "postgres";


COMMENT ON TABLE "public"."oauth_accounts" IS 'All oauth accounts information';



COMMENT ON COLUMN "public"."oauth_accounts"."linked_at" IS 'When account was first created/linked to oauth';



COMMENT ON COLUMN "public"."oauth_accounts"."missing_fields" IS 'Missing fields for user profile';



CREATE TABLE IF NOT EXISTS "public"."user_reminder_settings" (
    "user_id" "uuid" NOT NULL,
    "workout_reminders_enabled" boolean DEFAULT true NOT NULL,
    "reminder_offset_minutes" integer DEFAULT 60 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('UTC'::"text", "now"()) NOT NULL,
    "timezone" "text" DEFAULT '''UTC''::text'::"text"
);


ALTER TABLE "public"."user_reminder_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_split_information" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "split_id" bigint NOT NULL,
    "estimated_time_utc" timestamp with time zone NOT NULL,
    "confidence" numeric(3,2) DEFAULT 1.00 NOT NULL,
    "last_computed_at" timestamp with time zone DEFAULT "timezone"('UTC'::"text", "now"()) NOT NULL,
    "preferred_weekday" integer
);


ALTER TABLE "public"."user_split_information" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_split_information_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_split_information_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_split_information_id_seq" OWNED BY "public"."user_split_information"."id";



ALTER TABLE "public"."user_split_information" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_split_information_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "username" "text" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text" NOT NULL,
    "gender" "text" DEFAULT 'Unknown'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "profile_image_url" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "push_token" "text",
    "password" "text",
    "role" "text" DEFAULT 'User'::"text" NOT NULL,
    "is_first_login" boolean DEFAULT true NOT NULL,
    "token_version" bigint DEFAULT '0'::bigint NOT NULL,
    "is_verified" boolean DEFAULT false NOT NULL,
    "auth_provider" "text" DEFAULT 'app'::"text" NOT NULL
);

ALTER TABLE ONLY "public"."users" REPLICA IDENTITY FULL;


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'All registered users';



COMMENT ON COLUMN "public"."users"."token_version" IS 'Token version for two-devices validation';



COMMENT ON COLUMN "public"."users"."is_verified" IS 'Email validation';



COMMENT ON COLUMN "public"."users"."auth_provider" IS 'Auth provider (Apple, Google, App)';



CREATE TABLE IF NOT EXISTS "public"."users_subs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "started_at" timestamp with time zone NOT NULL,
    "subscription_receipt" "text",
    "will_renew" boolean DEFAULT false,
    "expires_at" timestamp with time zone NOT NULL,
    "external_transaction_id" "text",
    "status" "text" NOT NULL,
    "product_id" "text" NOT NULL
);


ALTER TABLE "public"."users_subs" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_subs" IS 'All users subscriptions data';



CREATE TABLE IF NOT EXISTS "public"."workoutsplits" (
    "id" bigint NOT NULL,
    "workout_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "muscle_group" "text",
    "is_active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."workoutsplits" OWNER TO "postgres";


COMMENT ON TABLE "public"."workoutsplits" IS 'All workout splits';



CREATE OR REPLACE VIEW "public"."v_exercisetoworkoutsplit_expanded" WITH ("security_invoker"='on') AS
 SELECT "ews"."id",
    "ews"."workoutsplit_id",
    "ws"."workout_id",
    "ews"."exercise_id",
    "ex"."name" AS "exercise",
    "ws"."name" AS "workoutsplit",
    "ews"."sets",
    "ews"."order_index",
    "ews"."created_at",
    "ews"."is_active"
   FROM (("public"."exercisetoworkoutsplit" "ews"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."id" = "ews"."workoutsplit_id")))
     JOIN "public"."exercises" "ex" ON (("ex"."id" = "ews"."exercise_id")));


ALTER VIEW "public"."v_exercisetoworkoutsplit_expanded" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_summary" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "workout_start_utc" timestamp with time zone NOT NULL,
    "workout_end_utc" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workoutsplit_id" bigint NOT NULL
);


ALTER TABLE "public"."workout_summary" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_exercisetracking_expanded" WITH ("security_invoker"='on') AS
 SELECT "et"."id",
    "et"."exercisetosplit_id",
    "et"."weight",
    "et"."reps",
    "ews"."exercise_id",
    "wsumm"."workoutsplit_id",
    "ws"."name" AS "splitname",
    "ex"."name" AS "exercise",
    "et"."notes",
    "et"."workout_summary_id",
    "wsumm"."workout_start_utc",
    "wsumm"."workout_end_utc"
   FROM (((("public"."exercisetracking" "et"
     LEFT JOIN "public"."workout_summary" "wsumm" ON (("wsumm"."id" = "et"."workout_summary_id")))
     LEFT JOIN "public"."exercisetoworkoutsplit" "ews" ON (("ews"."id" = "et"."exercisetosplit_id")))
     LEFT JOIN "public"."workoutsplits" "ws" ON (("ws"."id" = "wsumm"."workoutsplit_id")))
     LEFT JOIN "public"."exercises" "ex" ON (("ex"."id" = "ews"."exercise_id")));


ALTER VIEW "public"."v_exercisetracking_expanded" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_exercisetracking_set_simple" WITH ("security_invoker"='on') AS
 SELECT "et"."id",
    "et"."exercisetosplit_id",
    "et"."exercise_id",
    "et"."exercise",
    "s"."weight",
    "s"."reps",
    "et"."workout_summary_id",
    "et"."workout_start_utc",
    "et"."workout_end_utc"
   FROM ("public"."v_exercisetracking_expanded" "et"
     CROSS JOIN LATERAL UNNEST("et"."weight", "et"."reps") "s"("weight", "reps"));


ALTER VIEW "public"."v_exercisetracking_set_simple" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_prs" WITH ("security_invoker"='on') AS
 SELECT DISTINCT ON ("s"."exercise_id") "s"."id",
    "s"."exercisetosplit_id",
    "s"."exercise_id",
    "s"."exercise",
    "s"."weight",
    "s"."reps",
    "s"."workout_summary_id",
    "s"."workout_start_utc",
    "s"."workout_end_utc"
   FROM "public"."v_exercisetracking_set_simple" "s"
  WHERE (("s"."weight" IS NOT NULL) AND ("s"."reps" IS NOT NULL))
  ORDER BY "s"."exercise_id", "s"."weight" DESC, "s"."reps" DESC, "s"."workout_start_utc" DESC, "s"."id" DESC;


ALTER VIEW "public"."v_prs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workoutplans" (
    "id" bigint NOT NULL,
    "name" "text" DEFAULT 'My Workout'::"text" NOT NULL,
    "numberofsplits" bigint DEFAULT '1'::bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL,
    "level" "text" DEFAULT 'Beginner'::"text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trainer_id" "uuid",
    "is_active" boolean DEFAULT true NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);


ALTER TABLE "public"."workoutplans" OWNER TO "postgres";


COMMENT ON TABLE "public"."workoutplans" IS 'All workout plans';



COMMENT ON COLUMN "public"."workoutplans"."level" IS 'Level of the workout';



ALTER TABLE "public"."workoutplans" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."workoutplan_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."workoutsplits" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."workoutsplits_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."exercisetoworkoutsplit"
    ADD CONSTRAINT "ExerciseToWorkoutsplit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aerobictracking"
    ADD CONSTRAINT "aerobictracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercisetracking"
    ADD CONSTRAINT "exercisetracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."oauth_accounts"
    ADD CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."oauth_accounts"
    ADD CONSTRAINT "oauth_accounts_provider_user_unique" UNIQUE ("provider", "provider_user_id");



ALTER TABLE ONLY "public"."exercisetoworkoutsplit"
    ADD CONSTRAINT "uq_ets_split_exercise" UNIQUE ("workoutsplit_id", "exercise_id");



ALTER TABLE ONLY "public"."workoutsplits"
    ADD CONSTRAINT "uq_workoutsplits_plan_name" UNIQUE ("workout_id", "name");



ALTER TABLE ONLY "public"."user_reminder_settings"
    ADD CONSTRAINT "user_reminder_settings_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_split_information"
    ADD CONSTRAINT "user_split_information_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_split_information"
    ADD CONSTRAINT "user_split_information_user_id_split_id_key" UNIQUE ("user_id", "split_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_key1" UNIQUE ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_subs"
    ADD CONSTRAINT "users_subs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_summary"
    ADD CONSTRAINT "workout_summary_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workoutplans"
    ADD CONSTRAINT "workoutplan_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workoutsplits"
    ADD CONSTRAINT "workoutsplits_pkey" PRIMARY KEY ("id");



CREATE INDEX "aerobictracking_user_id_workout_time_utc_idx" ON "public"."aerobictracking" USING "btree" ("user_id", "workout_time_utc" DESC);



CREATE UNIQUE INDEX "exercises_name_unique" ON "public"."exercises" USING "btree" ("name");



CREATE INDEX "exercisetoworkoutsplit_active_idx" ON "public"."exercisetoworkoutsplit" USING "btree" ("workoutsplit_id", "order_index") WHERE ("is_active" = true);



CREATE INDEX "exercisetoworkoutsplit_workoutsplit_id_order_index_idx" ON "public"."exercisetoworkoutsplit" USING "btree" ("workoutsplit_id", "order_index");



CREATE INDEX "exercisetracking_workout_summary_id_idx" ON "public"."exercisetracking" USING "btree" ("workout_summary_id");



CREATE INDEX "messages_receiver_id_idx" ON "public"."messages" USING "btree" ("receiver_id");



CREATE UNIQUE INDEX "uq_workoutplans_active_user" ON "public"."workoutplans" USING "btree" ("user_id") WHERE "is_active";



CREATE INDEX "user_split_information_confidence_idx" ON "public"."user_split_information" USING "btree" ("preferred_weekday", "confidence") WHERE ("confidence" >= 0.60);



CREATE INDEX "user_split_information_user_weekday_idx" ON "public"."user_split_information" USING "btree" ("user_id", "preferred_weekday") WHERE ("preferred_weekday" IS NOT NULL);



CREATE UNIQUE INDEX "users_email_ci_unique" ON "public"."users" USING "btree" ("lower"(TRIM(BOTH FROM "email"))) WHERE ("email" IS NOT NULL);



CREATE UNIQUE INDEX "users_username_ci_unique" ON "public"."users" USING "btree" ("lower"(TRIM(BOTH FROM "username"))) WHERE ("username" IS NOT NULL);



CREATE INDEX "workout_summary_start_date_idx" ON "public"."workout_summary" USING "btree" (((("workout_start_utc" AT TIME ZONE 'UTC'::"text"))::"date"));



CREATE INDEX "workout_summary_user_start_utc_idx" ON "public"."workout_summary" USING "btree" ("user_id", "workout_start_utc" DESC);



CREATE INDEX "workoutsplits_workout_id_idx" ON "public"."workoutsplits" USING "btree" ("workout_id");



CREATE OR REPLACE TRIGGER "update_muscle_group_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."exercisetoworkoutsplit" FOR EACH ROW EXECUTE FUNCTION "public"."update_muscle_group_trigger_function"();



ALTER TABLE ONLY "public"."exercisetoworkoutsplit"
    ADD CONSTRAINT "ExerciseToWorkoutsplit_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercisetoworkoutsplit"
    ADD CONSTRAINT "ExerciseToWorkoutsplit_workoutsplit_id_fkey" FOREIGN KEY ("workoutsplit_id") REFERENCES "public"."workoutsplits"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."aerobictracking"
    ADD CONSTRAINT "aerobictracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercisetracking"
    ADD CONSTRAINT "exercisetracking_exercisetosplit_id_fkey" FOREIGN KEY ("exercisetosplit_id") REFERENCES "public"."exercisetoworkoutsplit"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercisetracking"
    ADD CONSTRAINT "exercisetracking_workout_summary_id_fkey" FOREIGN KEY ("workout_summary_id") REFERENCES "public"."workout_summary"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."oauth_accounts"
    ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_reminder_settings"
    ADD CONSTRAINT "user_reminder_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_split_information"
    ADD CONSTRAINT "user_split_information_split_id_fkey" FOREIGN KEY ("split_id") REFERENCES "public"."workoutsplits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_split_information"
    ADD CONSTRAINT "user_split_information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_subs"
    ADD CONSTRAINT "users_subs_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_summary"
    ADD CONSTRAINT "workout_summary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_summary"
    ADD CONSTRAINT "workout_summary_workoutsplit_id_fkey" FOREIGN KEY ("workoutsplit_id") REFERENCES "public"."workoutsplits"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutplans"
    ADD CONSTRAINT "workoutplans_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutplans"
    ADD CONSTRAINT "workoutplans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutsplits"
    ADD CONSTRAINT "workoutsplits_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workoutplans"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Allow all authenticated users to read exercises" ON "public"."exercises" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to update their own reminder settings" ON "public"."user_reminder_settings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow user to view senders in their messages" ON "public"."users" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."messages" "m"
  WHERE (("m"."sender_id" = "users"."id") AND ("m"."receiver_id" = "auth"."uid"())))));



CREATE POLICY "Enable delete for auth users on aerobictracking" ON "public"."aerobictracking" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable delete for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."workoutsplits"
     JOIN "public"."workoutplans" ON (("workoutplans"."id" = "workoutsplits"."workout_id")))
  WHERE (("workoutsplits"."id" = "exercisetoworkoutsplit"."workoutsplit_id") AND ("workoutplans"."user_id" = "auth"."uid"())))));



CREATE POLICY "Enable delete for auth users on messages" ON "public"."messages" FOR DELETE TO "authenticated" USING ((("auth"."uid"() = "sender_id") OR ("auth"."uid"() = "receiver_id")));



CREATE POLICY "Enable delete for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable delete for auth users on own profile" ON "public"."users" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Enable delete for auth users on workoutplans" ON "public"."workoutplans" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable delete for auth users on workoutsplits" ON "public"."workoutsplits" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workoutplans"
  WHERE (("workoutplans"."id" = "workoutsplits"."workout_id") AND ("workoutplans"."user_id" = "auth"."uid"())))));



CREATE POLICY "Enable insert for auth users on aerobictracking" ON "public"."aerobictracking" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));



CREATE POLICY "Enable insert for auth users on messages" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "sender_id") OR ("sender_id" = '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a'::"uuid")));



CREATE POLICY "Enable insert for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for auth users on own profile" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Enable insert for auth users on workoutplans" ON "public"."workoutplans" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for auth users on workoutsplits" ON "public"."workoutsplits" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));



CREATE POLICY "Enable insert for public users on own profile" ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Enable read access for auth users on aerobictracking" ON "public"."aerobictracking" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable read access for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR SELECT TO "authenticated" USING (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));



CREATE POLICY "Enable read access for auth users on messages" ON "public"."messages" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "sender_id") OR ("auth"."uid"() = "receiver_id")));



CREATE POLICY "Enable read access for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable read access for auth users on own profile" ON "public"."users" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Enable read access for auth users on workoutplans" ON "public"."workoutplans" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable read access for auth users on workoutsplits" ON "public"."workoutsplits" FOR SELECT TO "authenticated" USING (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));



CREATE POLICY "Enable update for auth users on aerobictracking" ON "public"."aerobictracking" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable update for auth users on exercisetoworkoutsplit" ON "public"."exercisetoworkoutsplit" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id")))) WITH CHECK (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM ("public"."workoutplans" "wp"
     JOIN "public"."workoutsplits" "ws" ON (("ws"."workout_id" = "wp"."id")))
  WHERE ("ws"."id" = "exercisetoworkoutsplit"."workoutsplit_id"))));



CREATE POLICY "Enable update for auth users on messages" ON "public"."messages" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "sender_id") OR ("auth"."uid"() = "receiver_id"))) WITH CHECK ((("auth"."uid"() = "sender_id") OR ("auth"."uid"() = "receiver_id")));



CREATE POLICY "Enable update for auth users on oauth_accounts" ON "public"."oauth_accounts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable update for auth users on own profile" ON "public"."users" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Enable update for auth users on workoutplans" ON "public"."workoutplans" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable update for auth users on workoutsplits" ON "public"."workoutsplits" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id")))) WITH CHECK (("auth"."uid"() = ( SELECT "wp"."user_id"
   FROM "public"."workoutplans" "wp"
  WHERE ("wp"."id" = "workoutsplits"."workout_id"))));



ALTER TABLE "public"."aerobictracking" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "auth can INSERT own reminder settings" ON "public"."user_reminder_settings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "auth can SELECT own reminder settings" ON "public"."user_reminder_settings" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "auth can UPDATE own reminder settings" ON "public"."user_reminder_settings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercisetoworkoutsplit" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercisetracking" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "exercisetracking_delete_by_summary_owner" ON "public"."exercisetracking" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "auth"."uid"())))));



CREATE POLICY "exercisetracking_insert_by_summary_owner" ON "public"."exercisetracking" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "auth"."uid"())))));



CREATE POLICY "exercisetracking_select_by_summary_owner" ON "public"."exercisetracking" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "auth"."uid"())))));



CREATE POLICY "exercisetracking_update_by_summary_owner" ON "public"."exercisetracking" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."workout_summary" "ws"
  WHERE (("ws"."id" = "exercisetracking"."workout_summary_id") AND ("ws"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."oauth_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_reminder_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_split_information" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can delete their workout summaries" ON "public"."workout_summary" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "users can insert their workout summaries" ON "public"."workout_summary" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "users can read their workout summaries" ON "public"."workout_summary" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "users can update their workout summaries" ON "public"."workout_summary" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."users_subs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_summary" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workoutplans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workoutsplits" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "app_user";



GRANT ALL ON FUNCTION "public"."housekeeping_compact_old_workouts"() TO "anon";
GRANT ALL ON FUNCTION "public"."housekeeping_compact_old_workouts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."housekeeping_compact_old_workouts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_owner_of_workoutsplit"("split_id_in" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."is_owner_of_workoutsplit"("split_id_in" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_owner_of_workoutsplit"("split_id_in" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_user_split_information"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_user_split_information"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_user_split_information"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_muscle_group_trigger_function"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_muscle_group_trigger_function"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_muscle_group_trigger_function"() TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetoworkoutsplit" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetoworkoutsplit" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetoworkoutsplit" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetoworkoutsplit" TO "app_user";



GRANT ALL ON SEQUENCE "public"."ExerciseToWorkoutsplit_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ExerciseToWorkoutsplit_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ExerciseToWorkoutsplit_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."ExerciseToWorkoutsplit_id_seq" TO "app_user";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."aerobictracking" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."aerobictracking" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."aerobictracking" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."aerobictracking" TO "app_user";



GRANT ALL ON SEQUENCE "public"."aerobictracking_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."aerobictracking_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."aerobictracking_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."aerobictracking_id_seq" TO "app_user";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercises" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercises" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercises" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercises" TO "app_user";



GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."exercises_id_seq" TO "app_user";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetracking" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetracking" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetracking" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."exercisetracking" TO "app_user";



GRANT ALL ON SEQUENCE "public"."exercisetracking_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercisetracking_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercisetracking_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."exercisetracking_id_seq" TO "app_user";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."messages" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."messages" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."messages" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."messages" TO "app_user";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."oauth_accounts" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."oauth_accounts" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."oauth_accounts" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."user_reminder_settings" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."user_reminder_settings" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."user_reminder_settings" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."user_split_information" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."user_split_information" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."user_split_information" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_split_information_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_split_information_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_split_information_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_split_information_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_split_information_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_split_information_id_seq1" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "app_user";



GRANT SELECT("profile_image_url") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT("id") ON TABLE "public"."users" TO "authenticated";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users_subs" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users_subs" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users_subs" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutsplits" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutsplits" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutsplits" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutsplits" TO "app_user";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetoworkoutsplit_expanded" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetoworkoutsplit_expanded" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetoworkoutsplit_expanded" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetoworkoutsplit_expanded" TO "app_user";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workout_summary" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workout_summary" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workout_summary" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetracking_expanded" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetracking_expanded" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetracking_expanded" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetracking_set_simple" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetracking_set_simple" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_exercisetracking_set_simple" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_prs" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_prs" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_prs" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutplans" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutplans" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutplans" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."workoutplans" TO "app_user";



GRANT ALL ON SEQUENCE "public"."workoutplan_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workoutplan_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workoutplan_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."workoutplan_id_seq" TO "app_user";



GRANT ALL ON SEQUENCE "public"."workoutsplits_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workoutsplits_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workoutsplits_id_seq" TO "service_role";
GRANT SELECT,USAGE ON SEQUENCE "public"."workoutsplits_id_seq" TO "app_user";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";






