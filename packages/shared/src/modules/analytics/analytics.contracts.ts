import { z } from 'zod/v4';
import type { Contract, ResponseOf } from '../../common';
import { adherenceExerciseStatsQueryDtoSchema, workoutRmRecordQueryDtoSchema } from './analytics.dtos';

// Get analytics

export const getAnalyticsResponseSchema = z.object({
  oneRepMaxes: z.record(z.string(), workoutRmRecordQueryDtoSchema),
  goals: z.record(z.string(), z.record(z.string(), adherenceExerciseStatsQueryDtoSchema)),
});

export const getAnalyticsContract = { response: getAnalyticsResponseSchema } satisfies Contract;

export type GetAnalyticsResponse = ResponseOf<typeof getAnalyticsContract>;
