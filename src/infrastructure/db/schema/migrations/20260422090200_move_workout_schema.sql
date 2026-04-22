ALTER TABLE IF EXISTS "public"."exercises" SET SCHEMA "workout";
ALTER TABLE IF EXISTS "public"."workoutplans" SET SCHEMA "workout";
ALTER TABLE IF EXISTS "public"."workoutsplits" SET SCHEMA "workout";
ALTER TABLE IF EXISTS "public"."exercisetoworkoutsplit" SET SCHEMA "workout";

ALTER SEQUENCE IF EXISTS "public"."exercises_id_seq" SET SCHEMA "workout";
ALTER SEQUENCE IF EXISTS "public"."workoutplan_id_seq" SET SCHEMA "workout";
ALTER SEQUENCE IF EXISTS "public"."workoutsplits_id_seq" SET SCHEMA "workout";
ALTER SEQUENCE IF EXISTS "public"."ExerciseToWorkoutsplit_id_seq" SET SCHEMA "workout";

DROP FUNCTION IF EXISTS "public"."update_muscle_group_trigger_function"();

CREATE OR REPLACE FUNCTION "workout"."update_muscle_group_trigger_function"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE workout.workoutsplits AS ws
  SET muscle_group = (
    SELECT STRING_AGG(t.targetmuscle || ' (' || t.specifics || ')', ', ')
    FROM (
      SELECT
        e.targetmuscle,
        STRING_AGG(DISTINCT e.specifictargetmuscle, ', ' ORDER BY e.specifictargetmuscle) AS specifics
      FROM workout.exercisetoworkoutsplit AS ew
      JOIN workout.exercises AS e ON e.id = ew.exercise_id
      WHERE ew.workoutsplit_id = COALESCE(NEW.workoutsplit_id, OLD.workoutsplit_id)
        AND ew.is_active = TRUE
        AND e.targetmuscle IS NOT NULL
      GROUP BY e.targetmuscle
    ) AS t
  )
  WHERE ws.id = COALESCE(NEW.workoutsplit_id, OLD.workoutsplit_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER "update_muscle_group_trigger"
AFTER INSERT OR DELETE OR UPDATE ON "workout"."exercisetoworkoutsplit"
FOR EACH ROW
EXECUTE FUNCTION "workout"."update_muscle_group_trigger_function"();

COMMENT ON SCHEMA "workout" IS 'Workout plans, split structure, and exercise catalog data';
