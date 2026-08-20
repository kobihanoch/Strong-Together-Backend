import { z } from 'zod/v4';
import { exerciseDbSchema, trackingSetDbSchema } from '../../database';

export const workoutRmRecordSchema = z.object({
  exercise: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight.nullable(),
  prReps: trackingSetDbSchema.shape.reps.nullable(),
  max1Rm: z.number(),
});

export const adherenceExerciseStatsSchema = z.object({
  planned: z.number(),
  actual: z.number(),
  adherencePct: z.number().nullable(),
});

export const getAnalyticsResponseSchema = z.object({
  oneRepMaxes: z.record(z.string(), workoutRmRecordSchema),
  goals: z.record(z.string(), z.record(z.string(), adherenceExerciseStatsSchema)),
});
