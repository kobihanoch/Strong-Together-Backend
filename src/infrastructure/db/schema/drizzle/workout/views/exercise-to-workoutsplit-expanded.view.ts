import { bigint, boolean, text, timestamp } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';
import { sql as drizzleSql } from 'drizzle-orm';

// Security-invoker view that expands planned split exercises.
export const exerciseToWorkoutSplitExpandedView = workoutSchema
  .view('v_exercisetoworkoutsplit_expanded', {
    id: bigint('id', { mode: 'number' }),
    workoutSplitId: bigint('workout_split_id', { mode: 'number' }),
    workoutId: bigint('workout_id', { mode: 'number' }),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    exercise: text('exercise'),
    workoutSplit: text('workoutsplit'),
    sets: bigint('sets', { mode: 'number' }).array(),
    orderIndex: bigint('order_index', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true }),
    isActive: boolean('is_active'),
  })
  .with({ securityInvoker: true }).as(drizzleSql`
    SELECT ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workoutsplit,
      ews.sets,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM workout.exercise_to_workout_split ews
    JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
    JOIN workout.exercise ex ON ex.id = ews.exercise_id
  `);
