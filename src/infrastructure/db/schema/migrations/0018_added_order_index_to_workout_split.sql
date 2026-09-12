ALTER TABLE "workout"."workout_split"
DROP CONSTRAINT "uq_workout_split_plan_name";

--> statement-breakpoint
ALTER TABLE "workout"."workout_split"
ADD COLUMN "order_index" INTEGER;

--> statement-breakpoint
WITH
  ranked_splits AS (
    SELECT
      id,
      (
        ROW_NUMBER() OVER (
          PARTITION BY
            workout_id,
            is_active
          ORDER BY
            id
        ) - 1
      )::INTEGER AS order_index
    FROM
      "workout"."workout_split"
  )
UPDATE "workout"."workout_split" AS ws
SET
  "order_index" = ranked.order_index
FROM
  ranked_splits AS ranked
WHERE
  ranked.id = ws.id;

--> statement-breakpoint
ALTER TABLE "workout"."workout_split"
ALTER COLUMN "order_index"
SET NOT NULL;

--> statement-breakpoint
CREATE UNIQUE INDEX "uq_active_workout_split_order_index" ON "workout"."workout_split" USING btree ("workout_id", "order_index")
WHERE
  "workout"."workout_split"."is_active" = TRUE;

--> statement-breakpoint
ALTER TABLE "workout"."workout_split"
ALTER COLUMN "created_at"
SET DEFAULT (NOW() AT TIME ZONE 'utc');
