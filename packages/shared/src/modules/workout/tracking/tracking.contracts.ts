import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../../common';
import { exerciseTrackingAndStatsQueryDtoSchema, finishedWorkoutEntryQueryDtoSchema } from './tracking.dtos';

// Get exercise tracking

export const getExerciseTrackingRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const getExerciseTrackingResponseSchema = exerciseTrackingAndStatsQueryDtoSchema;

export const getExerciseTrackingContract = {
  request: getExerciseTrackingRequestSchema,
  response: getExerciseTrackingResponseSchema,
} satisfies Contract;

// Finish user workout

export const finishWorkoutRequestSchema = z.object({
  body: z.object({
    workout: z.array(finishedWorkoutEntryQueryDtoSchema),
    tz: z.string().optional(),
    workoutStartUtc: z.string().datetime('workoutStartUtc must be a valid ISO datetime'),
    workoutEndUtc: z.string().datetime('workoutEndUtc must be a valid ISO datetime').optional().nullable(),
  }),
});
export const finishUserWorkoutResponseSchema = exerciseTrackingAndStatsQueryDtoSchema;
export const finishUserWorkoutContract = {
  request: finishWorkoutRequestSchema,
  response: finishUserWorkoutResponseSchema,
} satisfies Contract;

export type GetExerciseTrackingQuery = QueryOf<typeof getExerciseTrackingContract>;
export type GetExerciseTrackingResponse = ResponseOf<typeof getExerciseTrackingContract>;
export type FinishUserWorkoutBody = BodyOf<typeof finishUserWorkoutContract>;
export type FinishUserWorkoutResponse = ResponseOf<typeof finishUserWorkoutContract>;
