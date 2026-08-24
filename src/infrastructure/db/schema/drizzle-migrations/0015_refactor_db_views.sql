DROP VIEW "analytics"."v_prs";

--> statement-breakpoint
DROP VIEW "analytics"."v_exercise_tracking_set_simple";

--> statement-breakpoint
DROP VIEW "analytics"."v_exercise_tracking_expanded";

--> statement-breakpoint
DROP VIEW "workout"."v_exercise_to_workout_split_expanded";

--> statement-breakpoint
CREATE VIEW "analytics"."v_exercise_tracking_expanded"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      et.id,
      et.exercise_to_split_id,
      tracking_set.weight AS weight,
      tracking_set.reps AS reps,
      tracking_set.set_index AS set_index,
      COALESCE(ews.exercise_id, et.exercise_id) AS exercise_id,
      wsumm.workout_split_id,
      ws.name AS split_name,
      ex.name AS exercise,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc
    FROM
      tracking.exercise_tracking et
      LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
      LEFT JOIN workout.exercise_to_workout_split ews ON ews.id = et.exercise_to_split_id
      LEFT JOIN workout.workout_split ws ON ws.id = wsumm.workout_split_id
      LEFT JOIN workout.exercise ex ON ex.id = COALESCE(ews.exercise_id, et.exercise_id)
      LEFT JOIN tracking.tracking_set tracking_set ON tracking_set.exercise_tracking_id = et.id
  );

--> statement-breakpoint
CREATE VIEW "analytics"."v_prs"
WITH
  (security_invoker = TRUE) AS (
    SELECT DISTINCT
      ON (et.exercise_id) et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      et.weight,
      et.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM
      analytics.v_exercise_tracking_expanded et
    ORDER BY
      et.exercise_id,
      et.weight DESC,
      et.reps DESC,
      et.workout_start_utc DESC,
      et.id DESC
  );

--> statement-breakpoint
CREATE VIEW "workout"."v_exercise_to_workout_split_expanded"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workout_split,
      workout_set.reps AS reps,
      workout_set.order_index AS set_index,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM
      workout.exercise_to_workout_split ews
      JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
      JOIN workout.exercise ex ON ex.id = ews.exercise_id
      LEFT JOIN workout.workout_set workout_set ON workout_set.exercise_to_split_id = ews.id
    GROUP BY
      ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name,
      ws.name,
      workout_set.reps,
      workout_set.order_index,
      ews.order_index,
      ews.created_at,
      ews.is_active
  );
