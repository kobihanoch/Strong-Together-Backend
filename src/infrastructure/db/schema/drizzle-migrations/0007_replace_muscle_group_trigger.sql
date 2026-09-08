DROP TRIGGER "update_muscle_group_trigger" ON "workout"."exercise_to_workout_split";--> statement-breakpoint
DROP FUNCTION "workout"."update_muscle_group_trigger_function"();--> statement-breakpoint

CREATE FUNCTION "workout"."get_muscle_group"("workout_split_id_in" bigint)
RETURNS text
LANGUAGE sql
STABLE
SET search_path TO ''
AS $$
  SELECT STRING_AGG(t.target_muscle || ' (' || t.specifics || ')', ', ')
  FROM (
    SELECT e.target_muscle,
      STRING_AGG(DISTINCT e.specific_target_muscle, ', ' ORDER BY e.specific_target_muscle) AS specifics
    FROM workout.exercise_to_workout_split AS ew
    JOIN workout.exercise AS e ON e.id = ew.exercise_id
    WHERE ew.workout_split_id = workout_split_id_in
      AND ew.is_active = TRUE
      AND e.target_muscle IS NOT NULL
    GROUP BY e.target_muscle
  ) AS t;
$$;--> statement-breakpoint

REVOKE ALL ON FUNCTION "workout"."get_muscle_group"(bigint) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "workout"."get_muscle_group"(bigint) TO "authenticated";
