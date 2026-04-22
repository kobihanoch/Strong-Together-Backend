DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'Auth Providers'
  ) THEN
    ALTER TYPE "public"."Auth Providers" SET SCHEMA "identity";
  END IF;
END
$$;

DROP TABLE IF EXISTS "public"."users_subs";

ALTER TABLE IF EXISTS "public"."users" SET SCHEMA "identity";
ALTER TABLE IF EXISTS "public"."oauth_accounts" SET SCHEMA "identity";

ALTER TABLE ONLY "identity"."users" REPLICA IDENTITY FULL;

ALTER FUNCTION "identity"."current_user_id"() OWNER TO "postgres";

COMMENT ON SCHEMA "identity" IS 'Application-owned identity and account data';
