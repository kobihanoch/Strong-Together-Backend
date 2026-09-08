ALTER TABLE "workout"."workout_split" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
