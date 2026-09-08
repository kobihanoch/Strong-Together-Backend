DROP VIEW "tracking"."v_prs";--> statement-breakpoint
ALTER VIEW "analytics"."v_exercise_tracking_set_expanded" SET SCHEMA "tracking";--> statement-breakpoint
CREATE VIEW "tracking"."v_prs" WITH (security_invoker = true) AS (
    SELECT DISTINCT
      ON (et.exercise_id) et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      et.set_index,
      et.weight,
      et.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM
      tracking.v_exercise_tracking_set_expanded et
    ORDER BY
      et.exercise_id,
      et.weight DESC,
      et.reps DESC,
      et.workout_start_utc DESC,
      et.id DESC
  );--> statement-breakpoint
DROP SCHEMA "analytics";
