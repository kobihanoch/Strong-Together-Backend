import { z } from 'zod/v4';
import { timezoneSchema, type BodyOf, type Contract, type QueryOf, type ResponseOf } from '../../../common';
import { saveWorkoutSplitPayloadQueryDtoSchema, wholeUserWorkoutPlanQueryDtoSchema } from './plan.dtos';

// Get whole workout plan

export const getWorkoutPlanRequestSchema = z.object({ query: z.object({ tz: timezoneSchema.optional() }) });
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
    tz: timezoneSchema,
  }),
});
export const replaceWorkoutPlanResponseSchema = z.void();
export const replaceWorkoutPlanContract = {
  request: replaceWorkoutPlanRequestSchema,
  response: replaceWorkoutPlanResponseSchema,
} satisfies Contract;

/** Represents the get workout plan query value. */
export type GetWorkoutPlanQuery = QueryOf<typeof getWorkoutPlanContract>;
/** Represents the get workout plan response value. */
export type GetWorkoutPlanResponse = ResponseOf<typeof getWorkoutPlanContract>;
/** Represents the replace workout plan body value. */
export type ReplaceWorkoutPlanBody = BodyOf<typeof replaceWorkoutPlanContract>;
/** Represents the replace workout plan response value. */
export type ReplaceWorkoutPlanResponse = ResponseOf<typeof replaceWorkoutPlanContract>;
