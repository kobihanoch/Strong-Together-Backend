CREATE OR REPLACE FUNCTION "guest_api"."oauth_lookup"(provider_in text, provider_user_id_in text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT to_jsonb(o)
  FROM (
    SELECT user_id
    FROM identity.oauth_account
    WHERE provider = provider_in AND provider_user_id = provider_user_id_in
    LIMIT 1
  ) o;
$function$;
--> statement-breakpoint

DROP FUNCTION "guest_api"."oauth_create_user"(text, text, text, text, text, text, text);
--> statement-breakpoint

CREATE FUNCTION "guest_api"."oauth_create_user"(
  provider_in text, candidate_username_in text, email_in text, name_in text,
  provider_user_id_in text, provider_email_in text
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

  INSERT INTO identity.oauth_account (user_id, provider, provider_user_id, provider_email)
  VALUES (created_user_id, provider_in, provider_user_id_in, provider_email_in);

  INSERT INTO reminders.user_reminder_setting (user_id) VALUES (created_user_id);
  RETURN created_user_id;
END;
$function$;
--> statement-breakpoint

REVOKE ALL ON FUNCTION "guest_api"."oauth_create_user"(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "guest_api"."oauth_create_user"(text, text, text, text, text, text) TO "guest";
--> statement-breakpoint

ALTER TABLE "identity"."oauth_account" DROP COLUMN "missing_fields";
