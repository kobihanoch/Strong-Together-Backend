ALTER TABLE IF EXISTS "public"."messages" SET SCHEMA "messages";

ALTER TABLE ONLY "messages"."messages" REPLICA IDENTITY FULL;

ALTER TABLE "messages"."messages"
  ALTER COLUMN "sender_id" SET DEFAULT "identity"."current_user_id"();

ALTER TABLE "messages"."messages"
  ALTER COLUMN "receiver_id" SET DEFAULT "identity"."current_user_id"();

COMMENT ON SCHEMA "messages" IS 'User and system message inbox data';

