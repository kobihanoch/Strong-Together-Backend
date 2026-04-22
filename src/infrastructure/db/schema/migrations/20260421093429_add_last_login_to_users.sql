-- Modify "users" table
ALTER TABLE "public"."users" ADD COLUMN "last_login" timestamptz NULL;
