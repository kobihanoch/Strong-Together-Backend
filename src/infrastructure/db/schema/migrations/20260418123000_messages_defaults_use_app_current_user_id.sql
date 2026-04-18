ALTER TABLE "public"."messages"
  ALTER COLUMN "sender_id" SET DEFAULT app.current_user_id();

ALTER TABLE "public"."messages"
  ALTER COLUMN "receiver_id" SET DEFAULT app.current_user_id();
