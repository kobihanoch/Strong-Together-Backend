import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../../common';
import {
  saveWorkoutSplitPayloadQueryDtoSchema,
  wholeUserWorkoutPlanQueryDtoSchema,
} from './plan.dtos';

// Get whole workout plan

export const getWholeWorkoutPlanRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const getWholeUserWorkoutPlanResponseSchema = z.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable(),
});

export const getWholeUserWorkoutPlanContract = {
  request: getWholeWorkoutPlanRequestSchema,
  response: getWholeUserWorkoutPlanResponseSchema,
} satisfies Contract;

const workoutMutationResponseSchema = z.object({
  message: z.string(),
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema,
});

// Save workout

export const addWorkoutRequestSchema = z.object({
  body: z.object({
    workoutData: saveWorkoutSplitPayloadQueryDtoSchema,
    workoutName: z.string().optional(),
    tz: z.string(),
  }),
});
export const addWorkoutResponseSchema = workoutMutationResponseSchema;
export const addWorkoutContract = {
  request: addWorkoutRequestSchema,
  response: addWorkoutResponseSchema,
} satisfies Contract;

export type GetWholeUserWorkoutPlanQuery = QueryOf<typeof getWholeUserWorkoutPlanContract>;
export type GetWholeUserWorkoutPlanResponse = ResponseOf<typeof getWholeUserWorkoutPlanContract>;
export type AddWorkoutBody = BodyOf<typeof addWorkoutContract>;
export type AddWorkoutResponse = ResponseOf<typeof addWorkoutContract>;
