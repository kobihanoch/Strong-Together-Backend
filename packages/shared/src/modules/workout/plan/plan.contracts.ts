import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../../common';
import { saveWorkoutSplitPayloadQueryDtoSchema, wholeUserWorkoutPlanQueryDtoSchema } from './plan.dtos';

// Get whole workout plan

export const getWorkoutPlanRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const getWorkoutPlanResponseSchema = z.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable(),
});

export const getWorkoutPlanContract = {
  request: getWorkoutPlanRequestSchema,
  response: getWorkoutPlanResponseSchema,
} satisfies Contract;

// Save workout

export const replaceWorkoutPlanRequestSchema = z.object({
  body: z.object({
    workoutData: saveWorkoutSplitPayloadQueryDtoSchema,
    workoutName: z.string().optional(),
    tz: z.string(),
  }),
});
export const replaceWorkoutPlanResponseSchema = z.void();
export const replaceWorkoutPlanContract = {
  request: replaceWorkoutPlanRequestSchema,
  response: replaceWorkoutPlanResponseSchema,
} satisfies Contract;

export type GetWorkoutPlanQuery = QueryOf<typeof getWorkoutPlanContract>;
export type GetWorkoutPlanResponse = ResponseOf<typeof getWorkoutPlanContract>;
export type ReplaceWorkoutPlanBody = BodyOf<typeof replaceWorkoutPlanContract>;
export type ReplaceWorkoutPlanResponse = ResponseOf<typeof replaceWorkoutPlanContract>;
