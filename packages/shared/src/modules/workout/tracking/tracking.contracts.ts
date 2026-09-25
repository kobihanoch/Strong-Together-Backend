import { z } from 'zod/v4';
import { timezoneSchema, type BodyOf, type Contract, type QueryOf, type ResponseOf } from '../../../common';
import {
  exerciseTrackingMapsQueryDtoSchema,
  exerciseTrackingStatsQueryDtoSchema,
  exerciseHistoryQueryDtoSchema,
  finishedWorkoutEntryQueryDtoSchema,
  personalRecordsQueryDtoSchema,
} from './tracking.dtos';

// Get exercise tracking

export const getWorkoutHistoryRequestSchema = z.object({ query: z.object({ tz: timezoneSchema.optional() }) });
export const getWorkoutHistoryResponseSchema = exerciseTrackingMapsQueryDtoSchema;

export const getWorkoutHistoryContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutHistoryResponseSchema,
} satisfies Contract;

export const getExerciseHistoryRequestSchema = z.object({ query: z.object({ tz: timezoneSchema.optional() }) });
export const getExerciseHistoryResponseSchema = exerciseHistoryQueryDtoSchema;
export const getExerciseHistoryContract = {
  request: getExerciseHistoryRequestSchema,
  response: getExerciseHistoryResponseSchema,
} satisfies Contract;

export const getWorkoutStatisticsResponseSchema = exerciseTrackingStatsQueryDtoSchema;
export const getWorkoutStatisticsContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutStatisticsResponseSchema,
} satisfies Contract;

// Finish user workout

export const createWorkoutSessionRequestSchema = z.object({
  body: z
    .object({
      workout: z.array(finishedWorkoutEntryQueryDtoSchema).min(1, 'Workout must include at least one exercise').max(200),
      tz: timezoneSchema.optional(),
      workoutStartUtc: z.string().datetime({ offset: true, message: 'workoutStartUtc must be a valid ISO datetime' }),
      workoutEndUtc: z.string().datetime({ offset: true, message: 'workoutEndUtc must be a valid ISO datetime' }).optional().nullable(),
    })
    .refine((body) => !body.workoutEndUtc || Date.parse(body.workoutEndUtc) >= Date.parse(body.workoutStartUtc), {
      path: ['workoutEndUtc'],
      message: 'workoutEndUtc must not be earlier than workoutStartUtc',
    }),
});
export const createWorkoutSessionResponseSchema = z.void();
export const createWorkoutSessionContract = {
  request: createWorkoutSessionRequestSchema,
  response: createWorkoutSessionResponseSchema,
} satisfies Contract;

export const getPersonalRecordsResponseSchema = personalRecordsQueryDtoSchema;
export const getPersonalRecordsRequestSchema = z.object({ query: z.object({ tz: timezoneSchema.optional() }) });
export const getPersonalRecordsContract = {
  request: getPersonalRecordsRequestSchema,
  response: getPersonalRecordsResponseSchema,
} satisfies Contract;

/** Represents the get workout history query value. */
export type GetWorkoutHistoryQuery = QueryOf<typeof getWorkoutHistoryContract>;
/** Represents the get exercise history query value. */
export type GetExerciseHistoryQuery = QueryOf<typeof getExerciseHistoryContract>;
/** Represents the get personal records query value. */
export type GetPersonalRecordsQuery = QueryOf<typeof getPersonalRecordsContract>;
/** Represents the get workout history response value. */
export type GetWorkoutHistoryResponse = ResponseOf<typeof getWorkoutHistoryContract>;
/** Represents the get exercise history response value. */
export type GetExerciseHistoryResponse = ResponseOf<typeof getExerciseHistoryContract>;
/** Represents the get workout statistics response value. */
export type GetWorkoutStatisticsResponse = ResponseOf<typeof getWorkoutStatisticsContract>;
/** Represents the get personal records response value. */
export type GetPersonalRecordsResponse = ResponseOf<typeof getPersonalRecordsContract>;
/** Represents the create workout session body value. */
export type CreateWorkoutSessionBody = BodyOf<typeof createWorkoutSessionContract>;
/** Represents the create workout session response value. */
export type CreateWorkoutSessionResponse = ResponseOf<typeof createWorkoutSessionContract>;
