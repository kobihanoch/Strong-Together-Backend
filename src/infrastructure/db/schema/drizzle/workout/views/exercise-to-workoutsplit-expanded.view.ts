import { bigint, boolean, text, timestamp } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';
import { sql as drizzleSql } from 'drizzle-orm';

// Security-invoker view that expands planned split exercises.
export const exerciseToWorkoutSplitExpandedView = workoutSchema
  .view('v_exercise_to_workout_split_expanded', {
    id: bigint('id', { mode: 'number' }),
    workoutSplitId: bigint('workout_split_id', { mode: 'number' }),
    workoutId: bigint('workout_id', { mode: 'number' }),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    exercise: text('exercise'),
    workoutSplit: text('workout_split'),
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
      ws.name AS workout_split,
      COALESCE(
        array_agg(workout_set.reps::bigint ORDER BY workout_set.order_index)
          FILTER (WHERE workout_set.id IS NOT NULL),
        ARRAY[]::bigint[]
      ) AS sets,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM workout.exercise_to_workout_split ews
    JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
    JOIN workout.exercise ex ON ex.id = ews.exercise_id
    LEFT JOIN workout.workout_set workout_set ON workout_set.exercise_to_split_id = ews.id
    GROUP BY ews.id, ws.workout_id, ws.name, ex.name
  `);
