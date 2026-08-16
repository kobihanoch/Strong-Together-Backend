CREATE POLICY "Guest can read oauth accounts during public sign in" ON "identity"."oauth_account" AS PERMISSIVE FOR SELECT TO "guest" USING (true);--> statement-breakpoint
CREATE POLICY "Guest can create oauth links during public sign in" ON "identity"."oauth_account" AS PERMISSIVE FOR INSERT TO "guest" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Guest can read users for public auth flows" ON "identity"."user" AS PERMISSIVE FOR SELECT TO "guest" USING (true);--> statement-breakpoint
CREATE POLICY "Guest can create users during public auth flows" ON "identity"."user" AS PERMISSIVE FOR INSERT TO "guest" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Guest can update auth fields during public auth flows" ON "identity"."user" AS PERMISSIVE FOR UPDATE TO "guest" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Guest can create default reminder settings during registration" ON "reminders"."user_reminder_setting" AS PERMISSIVE FOR INSERT TO "guest" WITH CHECK (true);
--> statement-breakpoint

-- Public authentication reads these fields for login, verification, username
-- generation, OAuth email linking, and the login response. RLS still limits
-- access to requests that explicitly run as the guest role.
GRANT SELECT ON TABLE "identity"."user" TO "guest";
--> statement-breakpoint

-- Public authentication may update only authentication state and the email-change
-- verification flow. Ownership fields and unrelated profile fields remain protected.
GRANT UPDATE (
  "email",
  "password",
  "is_first_login",
  "token_version",
  "is_verified",
  "auth_provider",
  "last_login",
  "push_token"
) ON TABLE "identity"."user" TO "guest";
--> statement-breakpoint

-- Registration and OAuth may insert only the fields needed to create an account.
GRANT INSERT (
  "username",
  "email",
  "name",
  "gender",
  "password",
  "is_verified",
  "auth_provider"
) ON TABLE "identity"."user" TO "guest";
--> statement-breakpoint

-- OAuth callbacks need only provider lookup fields and the linked user id.
REVOKE ALL PRIVILEGES ON TABLE "identity"."oauth_account" FROM "guest";
GRANT SELECT (
  "user_id",
  "provider",
  "provider_user_id",
  "missing_fields"
) ON TABLE "identity"."oauth_account" TO "guest";
GRANT INSERT (
  "user_id",
  "provider",
  "provider_user_id",
  "provider_email",
  "missing_fields"
) ON TABLE "identity"."oauth_account" TO "guest";
--> statement-breakpoint

-- New accounts receive one default reminder row; every other reminder-setting
-- field must use its database default.
REVOKE ALL PRIVILEGES ON TABLE "reminders"."user_reminder_setting" FROM "guest";
GRANT INSERT ("user_id") ON TABLE "reminders"."user_reminder_setting" TO "guest";
