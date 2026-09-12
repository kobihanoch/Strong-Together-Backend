DROP VIEW "analytics"."v_prs";

--> statement-breakpoint
DROP VIEW "analytics"."v_exercise_tracking_set_simple";

--> statement-breakpoint
DROP VIEW "analytics"."v_exercise_tracking_expanded";

--> statement-breakpoint
DROP VIEW "workout"."v_exercise_to_workout_split_expanded";

--> statement-breakpoint
ALTER TABLE "identity"."user"
RENAME COLUMN "profile_image_path" TO "profile_pic_path";

--> statement-breakpoint
ALTER TABLE "identity"."user"
RENAME COLUMN "password" TO "password_hash";

--> statement-breakpoint
-- Keep the legacy redundant id uniqueness constraint: PostgreSQL selected its
-- backing index for existing foreign keys, so dropping it would cascade them.
ALTER TABLE "workout"."workout_plan"
DROP CONSTRAINT "workout_plan_trainer_id_fkey";

--> statement-breakpoint
DROP INDEX "identity"."user_email_ci_unique";

--> statement-breakpoint
DROP INDEX "identity"."user_username_ci_unique";

--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking"
ALTER COLUMN "exercise_to_split_id"
DROP NOT NULL;

--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split"
ALTER COLUMN "created_at"
SET DEFAULT (NOW() AT TIME ZONE 'utc');

--> statement-breakpoint
ALTER TABLE "workout"."workout_split"
ALTER COLUMN "created_at"
SET DEFAULT (NOW() AT TIME ZONE 'utc');

--> statement-breakpoint
ALTER TABLE "identity"."user"
ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc') NOT NULL;

--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking"
ADD COLUMN "exercise_id" BIGINT;

--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking"
ADD CONSTRAINT "exercise_tracking_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "workout"."exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_ci_unique" ON "identity"."user" USING btree (
  LOWER(
    TRIM(
      BOTH
      FROM
        "email"
    )
  )
);

--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_ci_unique" ON "identity"."user" USING btree (
  LOWER(
    TRIM(
      BOTH
      FROM
        "username"
    )
  )
);

--> statement-breakpoint
UPDATE "tracking"."aerobic_tracking"
SET
  "duration_sec" = ("duration_mins" * 60) + "duration_sec";

--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking"
DROP COLUMN "duration_mins";

--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking"
DROP COLUMN "weight";

--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking"
DROP COLUMN "reps";

--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split"
DROP COLUMN "sets";

--> statement-breakpoint
ALTER TABLE "workout"."workout_plan"
DROP COLUMN "name";

--> statement-breakpoint
ALTER TABLE "workout"."workout_plan"
DROP COLUMN "is_deleted";

--> statement-breakpoint
ALTER TABLE "workout"."workout_plan"
DROP COLUMN "level";

--> statement-breakpoint
ALTER TABLE "workout"."workout_plan"
DROP COLUMN "trainer_id";

--> statement-breakpoint
ALTER TABLE "workout"."workout_split"
DROP COLUMN "muscle_group";

--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking"
ADD CONSTRAINT "exercise_tracking_xor_check" CHECK (
  num_nonnulls (
    "tracking"."exercise_tracking"."exercise_to_split_id",
    "tracking"."exercise_tracking"."exercise_id"
  ) = 1
);

--> statement-breakpoint
CREATE VIEW "analytics"."v_exercise_tracking_expanded"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      et.id,
      et.exercise_to_split_id,
      COALESCE(
        ARRAY_AGG(
          tracking_set.weight
          ORDER BY
            tracking_set.set_index
        ) FILTER (
          WHERE
            tracking_set.id IS NOT NULL
        ),
        ARRAY[]::REAL[]
      ) AS weight,
      COALESCE(
        ARRAY_AGG(
          tracking_set.reps::BIGINT
          ORDER BY
            tracking_set.set_index
        ) FILTER (
          WHERE
            tracking_set.id IS NOT NULL
        ),
        ARRAY[]::BIGINT[]
      ) AS reps,
      COALESCE(ews.exercise_id, et.exercise_id) AS exercise_id,
      wsumm.workout_split_id,
      ws.name AS split_name,
      ex.name AS exercise,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc
    FROM
      tracking.exercise_tracking et
      LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
      LEFT JOIN workout.exercise_to_workout_split ews ON ews.id = et.exercise_to_split_id
      LEFT JOIN workout.workout_split ws ON ws.id = wsumm.workout_split_id
      LEFT JOIN workout.exercise ex ON ex.id = COALESCE(ews.exercise_id, et.exercise_id)
      LEFT JOIN tracking.tracking_set tracking_set ON tracking_set.exercise_tracking_id = et.id
    GROUP BY
      et.id,
      ews.exercise_id,
      et.exercise_id,
      wsumm.workout_split_id,
      ws.name,
      ex.name,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc
  );

--> statement-breakpoint
CREATE VIEW "workout"."v_exercise_to_workout_split_expanded"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workout_split,
      COALESCE(
        ARRAY_AGG(
          workout_set.reps::BIGINT
          ORDER BY
            workout_set.order_index
        ) FILTER (
          WHERE
            workout_set.id IS NOT NULL
        ),
        ARRAY[]::BIGINT[]
      ) AS sets,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM
      workout.exercise_to_workout_split ews
      JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
      JOIN workout.exercise ex ON ex.id = ews.exercise_id
      LEFT JOIN workout.workout_set workout_set ON workout_set.exercise_to_split_id = ews.id
    GROUP BY
      ews.id,
      ws.workout_id,
      ws.name,
      ex.name
  );

--> statement-breakpoint
CREATE VIEW "analytics"."v_exercise_tracking_set_simple"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      s.weight,
      s.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM
      analytics.v_exercise_tracking_expanded et
      CROSS JOIN LATERAL UNNEST(et.weight, et.reps) AS s (weight, reps)
  );

--> statement-breakpoint
CREATE VIEW "analytics"."v_prs"
WITH
  (security_invoker = TRUE) AS (
    SELECT DISTINCT
      ON (s.exercise_id) s.id,
      s.exercise_to_split_id,
      s.exercise_id,
      s.exercise,
      s.weight,
      s.reps,
      s.workout_summary_id,
      s.workout_start_utc,
      s.workout_end_utc
    FROM
      analytics.v_exercise_tracking_set_simple s
    WHERE
      s.weight IS NOT NULL
      AND s.reps IS NOT NULL
    ORDER BY
      s.exercise_id,
      s.weight DESC,
      s.reps DESC,
      s.workout_start_utc DESC,
      s.id DESC
  );

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
DECLARE created_user jsonb; created_id uuid;
BEGIN
  INSERT INTO identity."user" (username, name, email, gender, password_hash)
  VALUES (username_in, name_in, email_in, gender_in, password_in)
  RETURNING id,
    jsonb_build_object(
      'id', id, 'username', username, 'name', name, 'email', email,
      'gender', gender, 'role', role, 'created_at', created_at
    ) INTO created_id, created_user;

  INSERT INTO reminders.user_reminder_setting (user_id) VALUES (created_id);
  RETURN created_user;
END;
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION "guest_api"."find_user_by_username" (username_in TEXT) RETURNS JSONB LANGUAGE sql SECURITY DEFINER
SET
  search_path = pg_catalog AS $function$
  SELECT to_jsonb(u)
  FROM (
    SELECT id, name, username, password_hash, role, is_verified
    FROM identity."user"
    WHERE username = username_in
    LIMIT 1
  ) u;
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION "guest_api"."find_login_user" (identifier_in TEXT) RETURNS JSONB LANGUAGE sql SECURITY DEFINER
SET
  search_path = pg_catalog AS $function$
  SELECT to_jsonb(u)
  FROM (
    SELECT id, name, username, email, password_hash, last_login, is_verified, role
    FROM identity."user"
    WHERE auth_provider = 'app'
      AND (username = identifier_in OR email = identifier_in)
    LIMIT 1
  ) u;
$function$;

--> statement-breakpoint
