import { z } from 'zod';
import { exerciseTrackingAndStatsSchema } from '../../../validators/shared/responseSchemas.ts';

const finishedExerciseEntry = z.object({
  exercisetosplit_id: z.number(),
  weight: z.array(z.number()),
  reps: z.array(z.number()),
  notes: z.string().optional().nullable(),
});

export const finishWorkoutRequest = z.object({
  body: z.object({
    workout: z.array(finishedExerciseEntry),
    tz: z.string().optional(),
    workout_start_utc: z.string().datetime('workout_start_utc must be a valid ISO datetime'),
    workout_end_utc: z.string().datetime('workout_end_utc must be a valid ISO datetime').optional().nullable(),
  }),
});

export const finishUserWorkoutResponseSchema = exerciseTrackingAndStatsSchema;

export const getExerciseTrackingRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});

export const getExerciseTrackingResponseSchema = exerciseTrackingAndStatsSchema;
