CREATE ROLE "app_runtime_user" WITH NOINHERIT;--> statement-breakpoint
CREATE ROLE "guest";--> statement-breakpoint

-- The password is deliberately provisioned outside source control.
ALTER ROLE "app_runtime_user"
  WITH LOGIN NOCREATEDB NOCREATEROLE NOINHERIT;--> statement-breakpoint

GRANT "guest", "authenticated" TO "app_runtime_user";--> statement-breakpoint

-- Remove broad access inherited from the Atlas-era grants.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM PUBLIC, "anon", "app_user", "guest", "authenticated", "app_runtime_user";
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM PUBLIC, "anon", "app_user", "guest", "authenticated", "app_runtime_user";
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM PUBLIC, "anon", "app_user", "guest", "authenticated", "app_runtime_user";--> statement-breakpoint

REVOKE ALL ON SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages"
  FROM PUBLIC, "anon", "app_user", "guest", "authenticated", "app_runtime_user";
REVOKE CREATE ON SCHEMA "public" FROM PUBLIC;--> statement-breakpoint

-- Authenticated application requests receive normal domain access, subject to RLS.
GRANT USAGE ON SCHEMA "identity", "workout", "tracking", "reminders", "analytics", "messages"
  TO "authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  TO "authenticated";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  TO "authenticated";
GRANT EXECUTE ON FUNCTION "identity"."current_user_id"() TO "authenticated";

-- Registration is reserved for guest; authenticated cannot create another user.
REVOKE INSERT ON TABLE "identity"."users" FROM "authenticated";--> statement-breakpoint

-- Guest receives only the object privileges used by the existing registration flows.
-- RLS remains unchanged and continues to be the row-level enforcement layer.
GRANT USAGE ON SCHEMA "identity", "reminders" TO "guest";
GRANT INSERT ("username", "email", "name", "gender", "password", "is_verified", "auth_provider")
  ON TABLE "identity"."users" TO "guest";
GRANT SELECT ("id", "username", "email", "name", "gender", "role", "created_at", "auth_provider")
  ON TABLE "identity"."users" TO "guest";
GRANT INSERT ("user_id", "provider", "provider_user_id", "provider_email", "missing_fields")
  ON TABLE "identity"."oauth_accounts" TO "guest";
GRANT SELECT ("user_id", "provider", "provider_user_id", "provider_email", "missing_fields")
  ON TABLE "identity"."oauth_accounts" TO "guest";
GRANT INSERT ("user_id") ON TABLE "reminders"."user_reminder_settings" TO "guest";
GRANT EXECUTE ON FUNCTION "identity"."current_user_id"() TO "guest";--> statement-breakpoint

-- Keep future objects least-privileged instead of restoring the old GRANT ALL defaults.
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  REVOKE ALL ON TABLES FROM "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  REVOKE ALL ON SEQUENCES FROM "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  GRANT USAGE, SELECT ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA
  "identity", "workout", "tracking", "reminders", "analytics", "messages"
  REVOKE ALL ON FUNCTIONS FROM PUBLIC, "authenticated";
