import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../../common';
import {
  addWorkoutSplitPayloadQueryDtoSchema,
  wholeUserWorkoutPlanQueryDtoSchema,
  workoutSplitsMapQueryDtoSchema,
} from './plan.dtos';

// Get whole workout plan

export const getWholeWorkoutPlanRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const getWholeUserWorkoutPlanResponseSchema = z.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable(),
  workoutPlanForEditWorkout: workoutSplitsMapQueryDtoSchema.nullable(),
});

export const getWholeUserWorkoutPlanContract = {
  request: getWholeWorkoutPlanRequestSchema,
  response: getWholeUserWorkoutPlanResponseSchema,
} satisfies Contract;

// Add workout

export const addWorkoutRequestSchema = z.object({
  body: z.object({
    workoutData: addWorkoutSplitPayloadQueryDtoSchema,
    workoutName: z.string().optional(),
    tz: z.string(),
  }),
});
export const addWorkoutResponseSchema = z.object({
  message: z.string(),
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema,
  workoutPlanForEditWorkout: workoutSplitsMapQueryDtoSchema,
});
export const addWorkoutContract = {
  request: addWorkoutRequestSchema,
  response: addWorkoutResponseSchema,
} satisfies Contract;

export type GetWholeUserWorkoutPlanQuery = QueryOf<typeof getWholeUserWorkoutPlanContract>;
export type GetWholeUserWorkoutPlanResponse = ResponseOf<typeof getWholeUserWorkoutPlanContract>;
export type AddWorkoutBody = BodyOf<typeof addWorkoutContract>;
export type AddWorkoutResponse = ResponseOf<typeof addWorkoutContract>;
