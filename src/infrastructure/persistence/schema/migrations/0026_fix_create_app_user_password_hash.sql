DROP FUNCTION "guest_api"."create_app_user"(TEXT, TEXT, TEXT, TEXT, TEXT);

--> statement-breakpoint
CREATE FUNCTION "guest_api"."create_app_user" (
  username_in TEXT,
  name_in TEXT,
  email_in TEXT,
  gender_in TEXT,
  password_hash_in TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog AS $function$
DECLARE created_user jsonb;
BEGIN
  INSERT INTO identity."user" (username, name, email, gender, password_hash)
  VALUES (username_in, name_in, email_in, gender_in, password_hash_in)
  RETURNING jsonb_build_object(
    'id', id,
    'username', username,
    'name', name,
    'email', email,
    'gender', gender,
    'role', role,
    'created_at', created_at
  ) INTO created_user;

  RETURN created_user;
END;
$function$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "guest_api"."create_app_user"(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;

--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "guest_api"."create_app_user"(TEXT, TEXT, TEXT, TEXT, TEXT) TO "guest";
