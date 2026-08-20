ALTER TABLE "workout"."workout_plan" DROP COLUMN "numberofsplits";--> statement-breakpoint

CREATE FUNCTION "workout"."get_number_of_splits"("workout_plan_id_in" bigint)
RETURNS bigint
LANGUAGE sql
STABLE
SET search_path TO ''
AS $$
  SELECT COUNT(*)
  FROM workout.workout_split AS ws
  WHERE ws.workout_id = workout_plan_id_in
    AND ws.is_active = TRUE;
$$;--> statement-breakpoint

REVOKE ALL ON FUNCTION "workout"."get_number_of_splits"(bigint) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "workout"."get_number_of_splits"(bigint) TO "authenticated";
