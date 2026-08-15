import { bigint, boolean, text, timestamp } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';

// Existing security-invoker view that expands planned split exercises.
export const exerciseToWorkoutsplitExpandedView = workoutSchema
  .view('v_exercisetoworkoutsplit_expanded', {
    id: bigint('id', { mode: 'number' }),
    workoutsplitId: bigint('workoutsplit_id', { mode: 'number' }),
    workoutId: bigint('workout_id', { mode: 'number' }),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    exercise: text('exercise'),
    workoutsplit: text('workoutsplit'),
    sets: bigint('sets', { mode: 'number' }).array(),
    orderIndex: bigint('order_index', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true }),
    isActive: boolean('is_active'),
  })
  .with({ securityInvoker: true })
  .existing();
