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
  .as(drizzleSql`
    SELECT DISTINCT ON (s.exercise_id)
      s.id,
      s.exercise_to_split_id,
      s.exercise_id,
      s.exercise,
      s.weight,
      s.reps,
      s.workout_summary_id,
      s.workout_start_utc,
      s.workout_end_utc
    FROM analytics.v_exercisetracking_set_simple s
    WHERE s.weight IS NOT NULL AND s.reps IS NOT NULL
    ORDER BY s.exercise_id, s.weight DESC, s.reps DESC, s.workout_start_utc DESC, s.id DESC
  `);
