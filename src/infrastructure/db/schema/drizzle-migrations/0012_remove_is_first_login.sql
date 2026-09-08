-- last_login is now the single source of truth: NULL means the user has never logged in.
ALTER TABLE "identity"."user" DROP COLUMN "is_first_login";
