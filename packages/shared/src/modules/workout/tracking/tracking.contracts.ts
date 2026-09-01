import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../../common';
import {
  exerciseTrackingAndStatsQueryDtoSchema,
  exerciseTrackingMapsQueryDtoSchema,
  exerciseTrackingStatsQueryDtoSchema,
  finishedWorkoutEntryQueryDtoSchema,
} from './tracking.dtos';

// Get exercise tracking

export const getWorkoutHistoryRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const getWorkoutHistoryResponseSchema = exerciseTrackingMapsQueryDtoSchema;

export const getWorkoutHistoryContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutHistoryResponseSchema,
} satisfies Contract;

export const getWorkoutStatisticsResponseSchema = exerciseTrackingStatsQueryDtoSchema;
export const getWorkoutStatisticsContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutStatisticsResponseSchema,
} satisfies Contract;

// Finish user workout

export const createWorkoutSessionRequestSchema = z.object({
  body: z.object({
    workout: z.array(finishedWorkoutEntryQueryDtoSchema),
    tz: z.string().optional(),
    workoutStartUtc: z.string().datetime('workoutStartUtc must be a valid ISO datetime'),
    workoutEndUtc: z.string().datetime('workoutEndUtc must be a valid ISO datetime').optional().nullable(),
  }),
});
export const createWorkoutSessionResponseSchema = exerciseTrackingAndStatsQueryDtoSchema;
export const createWorkoutSessionContract = {
  request: createWorkoutSessionRequestSchema,
  response: createWorkoutSessionResponseSchema,
} satisfies Contract;

export type GetWorkoutHistoryQuery = QueryOf<typeof getWorkoutHistoryContract>;
export type GetWorkoutHistoryResponse = ResponseOf<typeof getWorkoutHistoryContract>;
export type GetWorkoutStatisticsResponse = ResponseOf<typeof getWorkoutStatisticsContract>;
export type CreateWorkoutSessionBody = BodyOf<typeof createWorkoutSessionContract>;
export type CreateWorkoutSessionResponse = ResponseOf<typeof createWorkoutSessionContract>;
