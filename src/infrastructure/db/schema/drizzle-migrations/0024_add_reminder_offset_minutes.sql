DELETE FROM "reminders"."user_reminder_setting";

--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting"
ADD COLUMN "reminder_offset_minutes" INTEGER NOT NULL;
