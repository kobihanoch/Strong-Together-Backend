import { bigint, boolean, text, timestamp } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';
import { sql as drizzleSql } from 'drizzle-orm';

// Security-invoker view that expands planned split exercises.
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
  .with({ securityInvoker: true }).as(drizzleSql`
    SELECT ews.id,
      ews.workoutsplit_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workoutsplit,
      ews.sets,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM workout.exercisetoworkoutsplit ews
    JOIN workout.workoutsplits ws ON ws.id = ews.workoutsplit_id
    JOIN workout.exercises ex ON ex.id = ews.exercise_id
  `);
