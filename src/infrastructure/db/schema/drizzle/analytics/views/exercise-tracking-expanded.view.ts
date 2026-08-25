import { sql as drizzleSql } from 'drizzle-orm';
import { bigint, boolean, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { analyticsSchema } from '../../schemas';
import { integer } from 'drizzle-orm/pg-core';

// Security-invoker view that joins exercise tracking to workout metadata.
export const exerciseTrackingSetExpandedView = analyticsSchema
  .view('v_exercise_tracking_set_expanded', {
    id: bigint('id', { mode: 'number' }),
    exerciseToSplitId: bigint('exercise_to_split_id', { mode: 'number' }),
    weight: real('weight'),
    reps: bigint('reps', { mode: 'number' }),
    orderIndex: integer('order_index'),
    setIndex: integer('set_index'),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    workoutSplitId: bigint('workout_split_id', { mode: 'number' }),
    splitName: text('split_name'),
    exercise: text('exercise'),
    targetMuscle: text('target_muscle'),
    specificTargetMuscle: text('specific_target_muscle'),
    notes: text('notes'),
    workoutSummaryId: uuid('workout_summary_id'),
    workoutStartUtc: timestamp('workout_start_utc', { withTimezone: true }),
    workoutEndUtc: timestamp('workout_end_utc', { withTimezone: true }),
    isAssignedToSplit: boolean('is_assigned_to_split'),
  })
  .with({ securityInvoker: true })
  .as(drizzleSql /*sql*/ `
    SELECT
      et.id,
      et.exercise_to_split_id,
      tracking_set.weight AS weight,
      tracking_set.reps AS reps,
      ews.order_index AS order_index,
      tracking_set.set_index AS set_index,
      COALESCE(ews.exercise_id, et.exercise_id) AS exercise_id,
      wsumm.workout_split_id,
      ws.name AS split_name,
      ex.name AS exercise,
      ex.target_muscle AS target_muscle,
      ex.specific_target_muscle AS specific_target_muscle,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc,
      CASE
        WHEN et.exercise_to_split_id IS NOT NULL THEN TRUE
        WHEN et.exercise_id IS NOT NULL THEN FALSE
      END AS is_assigned_to_split
    FROM
      tracking.exercise_tracking et
      LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
      LEFT JOIN workout.exercise_to_workout_split ews ON ews.id = et.exercise_to_split_id
      LEFT JOIN workout.workout_split ws ON ws.id = wsumm.workout_split_id
      LEFT JOIN workout.exercise ex ON ex.id = COALESCE(ews.exercise_id, et.exercise_id)
      LEFT JOIN tracking.tracking_set tracking_set ON tracking_set.exercise_tracking_id = et.id
  `);
