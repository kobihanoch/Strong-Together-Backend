DROP VIEW "analytics"."v_prs";--> statement-breakpoint
DROP VIEW "analytics"."v_exercise_tracking_set_simple";--> statement-breakpoint
DROP VIEW "analytics"."v_exercise_tracking_expanded";--> statement-breakpoint
DROP VIEW "workout"."v_exercise_to_workout_split_expanded";--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ALTER COLUMN "weight" SET DEFAULT ARRAY[]::real[];--> statement-breakpoint
ALTER TABLE "tracking"."exercise_tracking" ALTER COLUMN "reps" SET DEFAULT ARRAY[]::bigint[];--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ALTER COLUMN "sets" SET DEFAULT ARRAY[]::bigint[];--> statement-breakpoint
CREATE VIEW "analytics"."v_exercise_tracking_expanded" WITH (security_invoker = true) AS (
    SELECT et.id,
      et.exercise_to_split_id,
      CASE WHEN count(tracking_set.id) > 0
        THEN array_agg(tracking_set.weight ORDER BY tracking_set.set_index)
          FILTER (WHERE tracking_set.id IS NOT NULL)
        ELSE et.weight
      END AS weight,
      CASE WHEN count(tracking_set.id) > 0
        THEN array_agg(tracking_set.reps::bigint ORDER BY tracking_set.set_index)
          FILTER (WHERE tracking_set.id IS NOT NULL)
        ELSE et.reps
      END AS reps,
      ews.exercise_id,
      wsumm.workout_split_id,
      ws.name AS split_name,
      ex.name AS exercise,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc
    FROM tracking.exercise_tracking et
    LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
    LEFT JOIN workout.exercise_to_workout_split ews ON ews.id = et.exercise_to_split_id
    LEFT JOIN workout.workout_split ws ON ws.id = wsumm.workout_split_id
    LEFT JOIN workout.exercise ex ON ex.id = ews.exercise_id
    LEFT JOIN tracking.tracking_set tracking_set ON tracking_set.exercise_tracking_id = et.id
    GROUP BY et.id, ews.exercise_id, wsumm.workout_split_id, ws.name, ex.name,
      wsumm.workout_start_utc, wsumm.workout_end_utc, et.weight, et.reps
  );--> statement-breakpoint
CREATE VIEW "analytics"."v_exercise_tracking_set_simple" WITH (security_invoker = true) AS (
    SELECT et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      s.weight,
      s.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM analytics.v_exercise_tracking_expanded et
    CROSS JOIN LATERAL UNNEST(et.weight, et.reps) s(weight, reps)
  );--> statement-breakpoint
CREATE VIEW "analytics"."v_prs" WITH (security_invoker = true) AS (
    SELECT DISTINCT ON (s.exercise_id)
      s.id, s.exercise_to_split_id, s.exercise_id, s.exercise, s.weight, s.reps,
      s.workout_summary_id, s.workout_start_utc, s.workout_end_utc
    FROM analytics.v_exercise_tracking_set_simple s
    WHERE s.weight IS NOT NULL AND s.reps IS NOT NULL
    ORDER BY s.exercise_id, s.weight DESC, s.reps DESC, s.workout_start_utc DESC, s.id DESC
  );--> statement-breakpoint
CREATE VIEW "workout"."v_exercise_to_workout_split_expanded" WITH (security_invoker = true) AS (
    SELECT ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workout_split,
      CASE WHEN count(workout_set.id) > 0
        THEN array_agg(workout_set.reps::bigint ORDER BY workout_set.order_index)
          FILTER (WHERE workout_set.id IS NOT NULL)
        ELSE ews.sets
      END AS sets,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM workout.exercise_to_workout_split ews
    JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
    JOIN workout.exercise ex ON ex.id = ews.exercise_id
    LEFT JOIN workout.workout_set workout_set ON workout_set.exercise_to_split_id = ews.id
    GROUP BY ews.id, ws.workout_id, ws.name, ex.name, ews.sets
  );
