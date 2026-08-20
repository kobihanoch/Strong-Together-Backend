import { z } from 'zod/v4';
import { adherenceExerciseStatsSchema, getAnalyticsResponseSchema, workoutRmRecordSchema } from './analytics.schemas';

export type WorkoutRMRecord = z.infer<typeof workoutRmRecordSchema>;
export type WorkoutRMsResponse = z.infer<typeof getAnalyticsResponseSchema.shape.oneRepMaxes>;
export type AdherenceExerciseStats = z.infer<typeof adherenceExerciseStatsSchema>;
export type GoalAdherenceResponse = z.infer<typeof getAnalyticsResponseSchema.shape.goals>;
