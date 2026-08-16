import { sql as drizzleSql } from 'drizzle-orm';
import { bigint, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { analyticsSchema } from '../../schemas';

// Security-invoker view that joins exercise tracking to workout metadata.
export const exerciseTrackingExpandedView = analyticsSchema
  .view('v_exercisetracking_expanded', {
    id: bigint('id', { mode: 'number' }),
    exerciseToSplitId: bigint('exercisetosplit_id', { mode: 'number' }),
    weight: real('weight').array(),
    reps: bigint('reps', { mode: 'number' }).array(),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    workoutSplitId: bigint('workoutsplit_id', { mode: 'number' }),
    splitName: text('splitname'),
    exercise: text('exercise'),
    notes: text('notes'),
    workoutSummaryId: uuid('workout_summary_id'),
    workoutStartUtc: timestamp('workout_start_utc', { withTimezone: true }),
    workoutEndUtc: timestamp('workout_end_utc', { withTimezone: true }),
  })
  .with({ securityInvoker: true })
  .as(drizzleSql`
    SELECT et.id,
      et.exercisetosplit_id,
      et.weight,
      et.reps,
      ews.exercise_id,
      wsumm.workoutsplit_id,
      ws.name AS splitname,
      ex.name AS exercise,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc
    FROM tracking.exercisetracking et
    LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
    LEFT JOIN workout.exercisetoworkoutsplit ews ON ews.id = et.exercisetosplit_id
    LEFT JOIN workout.workoutsplits ws ON ws.id = wsumm.workoutsplit_id
    LEFT JOIN workout.exercises ex ON ex.id = ews.exercise_id
  `);
