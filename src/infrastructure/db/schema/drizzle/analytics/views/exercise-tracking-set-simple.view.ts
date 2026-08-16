import { sql as drizzleSql } from 'drizzle-orm';
import { bigint, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { analyticsSchema } from '../../schemas';

// Security-invoker view that expands the paired weight/reps arrays into sets.
export const exerciseTrackingSetSimpleView = analyticsSchema
  .view('v_exercisetracking_set_simple', {
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
  .as(drizzleSql`
    SELECT et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      s.weight,
      s.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM analytics.v_exercisetracking_expanded et
    CROSS JOIN LATERAL UNNEST(et.weight, et.reps) s(weight, reps)
  `);
