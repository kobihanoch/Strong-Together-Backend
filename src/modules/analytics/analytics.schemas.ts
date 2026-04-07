import { z } from 'zod';

export const workoutRmRecordSchema = z.object({
  exercise: z.string(),
  pr_weight: z.number().nullable(),
  pr_reps: z.number().nullable(),
  max_1rm: z.number(),
});

export const adherenceExerciseStatsSchema = z.object({
  planned: z.number(),
  actual: z.number(),
  adherence_pct: z.number().nullable(),
});

export const getAnalyticsResponseSchema = z.object({
  _1RM: z.record(z.string(), workoutRmRecordSchema),
  goals: z.record(z.string(), z.record(z.string(), adherenceExerciseStatsSchema)),
});
