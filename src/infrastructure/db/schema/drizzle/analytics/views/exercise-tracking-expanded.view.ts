import { sql as drizzleSql } from 'drizzle-orm';
import { bigint, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { analyticsSchema } from '../../schemas';

// Security-invoker view that joins exercise tracking to workout metadata.
export const exerciseTrackingExpandedView = analyticsSchema
  .view('v_exercise_tracking_expanded', {
    id: bigint('id', { mode: 'number' }),
    exerciseToSplitId: bigint('exercise_to_split_id', { mode: 'number' }),
    weight: real('weight').array(),
    reps: bigint('reps', { mode: 'number' }).array(),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    workoutSplitId: bigint('workout_split_id', { mode: 'number' }),
    splitName: text('split_name'),
    exercise: text('exercise'),
    notes: text('notes'),
    workoutSummaryId: uuid('workout_summary_id'),
    workoutStartUtc: timestamp('workout_start_utc', { withTimezone: true }),
    workoutEndUtc: timestamp('workout_end_utc', { withTimezone: true }),
  })
  .with({ securityInvoker: true }).as(drizzleSql`
    SELECT 
      et.id,
      et.exercise_to_split_id,
      COALESCE(
        array_agg(tracking_set.weight ORDER BY tracking_set.set_index)
          FILTER (WHERE tracking_set.id IS NOT NULL),
        ARRAY[]::real[]
      ) AS weight,
      COALESCE(
        array_agg(tracking_set.reps::bigint ORDER BY tracking_set.set_index)
          FILTER (WHERE tracking_set.id IS NOT NULL),
        ARRAY[]::bigint[]
      ) AS reps,
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
      wsumm.workout_start_utc, wsumm.workout_end_utc
  `);
