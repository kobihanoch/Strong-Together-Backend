DROP POLICY "Guest can read oauth accounts during public sign in" ON "identity"."oauth_account" CASCADE;--> statement-breakpoint
DROP POLICY "Guest can create oauth links during public sign in" ON "identity"."oauth_account" CASCADE;--> statement-breakpoint
DROP POLICY "Guest can read users for public auth flows" ON "identity"."user" CASCADE;--> statement-breakpoint
DROP POLICY "Guest can create users during public auth flows" ON "identity"."user" CASCADE;--> statement-breakpoint
DROP POLICY "Guest can update auth fields during public auth flows" ON "identity"."user" CASCADE;--> statement-breakpoint
DROP POLICY "Guest can create default reminder settings during registration" ON "reminders"."user_reminder_setting" CASCADE;
--> statement-breakpoint

-- Guest can execute only this deliberately small API surface. It receives no
-- direct access to application schemas or tables.
CREATE SCHEMA IF NOT EXISTS "guest_api";
REVOKE ALL ON SCHEMA "guest_api" FROM PUBLIC;
GRANT USAGE ON SCHEMA "guest_api" TO "guest";
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."find_login_user"(identifier_in text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT to_jsonb(u)
  FROM (
    SELECT id, name, username, email, password, last_login, is_verified, role
    FROM identity."user"
    WHERE auth_provider = 'app'
      AND (username = identifier_in OR email = identifier_in)
    LIMIT 1
  ) u;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."find_user_by_username"(username_in text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT to_jsonb(u)
  FROM (
    SELECT id, name, username, password, role, is_verified
    FROM identity."user"
    WHERE username = username_in
    LIMIT 1
  ) u;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."find_user_for_email"(email_in text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT to_jsonb(u)
  FROM (
    SELECT id, email, name, username
    FROM identity."user"
    WHERE email = email_in
    LIMIT 1
  ) u;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."user_exists"(username_in text, email_in text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT id
  FROM identity."user"
  WHERE username = username_in OR email = email_in
  LIMIT 1;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."verification_state"(username_in text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT is_verified FROM identity."user" WHERE username = username_in LIMIT 1;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."create_app_user"(
  username_in text, name_in text, email_in text, gender_in text, password_in text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE created_user jsonb; created_id uuid;
BEGIN
  INSERT INTO identity."user" (username, name, email, gender, password)
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

CREATE OR REPLACE FUNCTION "guest_api"."oauth_lookup"(provider_in text, provider_user_id_in text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT to_jsonb(o)
  FROM (
    SELECT user_id, missing_fields
    FROM identity.oauth_account
    WHERE provider = provider_in AND provider_user_id = provider_user_id_in
    LIMIT 1
  ) o;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."oauth_link_by_email"(
  provider_in text, email_in text, provider_user_id_in text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE linked_user_id uuid;
BEGIN
  SELECT id INTO linked_user_id
  FROM identity."user"
  WHERE lower(email) = lower(email_in)
  FOR UPDATE
  LIMIT 1;

  IF linked_user_id IS NULL THEN RETURN NULL; END IF;

  INSERT INTO identity.oauth_account (user_id, provider, provider_user_id, provider_email)
  VALUES (linked_user_id, provider_in, provider_user_id_in, email_in)
  ON CONFLICT (provider, provider_user_id) DO NOTHING;

  UPDATE identity."user" SET auth_provider = provider_in WHERE id = linked_user_id;
  RETURN linked_user_id;
END;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."oauth_create_user"(
  provider_in text, candidate_username_in text, email_in text, name_in text,
  missing_fields_in text, provider_user_id_in text, provider_email_in text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
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

  INSERT INTO identity.oauth_account (user_id, provider, provider_user_id, provider_email, missing_fields)
  VALUES (created_user_id, provider_in, provider_user_id_in, provider_email_in, missing_fields_in);

  INSERT INTO reminders.user_reminder_setting (user_id) VALUES (created_user_id);
  RETURN created_user_id;
END;
$function$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION "guest_api"."last_login"(user_id_in uuid)
RETURNS timestamptz
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT last_login FROM identity."user" WHERE id = user_id_in;
$function$;
--> statement-breakpoint

-- Remove every direct guest privilege before granting function execution.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM "guest";
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM "guest";
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM "guest";
REVOKE ALL ON SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM "guest";
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA "guest_api" FROM PUBLIC;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "guest_api" TO "guest";
