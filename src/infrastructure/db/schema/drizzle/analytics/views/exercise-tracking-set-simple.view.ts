import { bigint, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { analyticsSchema } from '../../schemas';

// Existing security-invoker view that expands the paired weight/reps arrays into sets.
export const exerciseTrackingSetSimpleView = analyticsSchema
  .view('v_exercisetracking_set_simple', {
    id: bigint('id', { mode: 'number' }),
    exercisetosplitId: bigint('exercisetosplit_id', { mode: 'number' }),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    exercise: text('exercise'),
    weight: real('weight'),
    reps: bigint('reps', { mode: 'number' }),
    workoutSummaryId: uuid('workout_summary_id'),
    workoutStartUtc: timestamp('workout_start_utc', { withTimezone: true }),
    workoutEndUtc: timestamp('workout_end_utc', { withTimezone: true }),
  })
  .with({ securityInvoker: true })
  .existing();

