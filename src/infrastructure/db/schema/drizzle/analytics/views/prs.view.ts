import { sql as drizzleSql } from 'drizzle-orm';
import { bigint, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { analyticsSchema } from '../../schemas';

// Security-invoker view that selects the strongest recorded set per exercise.
export const prsView = analyticsSchema
  .view('v_prs', {
    id: bigint('id', { mode: 'number' }),
    exerciseToSplitId: bigint('exercise_to_split_id', { mode: 'number' }),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    exercise: text('exercise'),
    weight: real('weight'),
    reps: bigint('reps', { mode: 'number' }),
    workoutSummaryId: uuid('workout_summary_id'),
    workoutStartUtc: timestamp('workout_start_utc', { withTimezone: true }),
    workoutEndUtc: timestamp('workout_end_utc', { withTimezone: true }),
  })
  .with({ securityInvoker: true })
  .as(drizzleSql /*sql*/ `
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
      analytics.v_exercise_tracking_set_expanded et
    ORDER BY
      et.exercise_id,
      et.weight DESC,
      et.reps DESC,
      et.workout_start_utc DESC,
      et.id DESC
  `);
