import z from 'zod/v4';
import {
  addWorkoutRequest,
  addWorkoutResponseSchema,
  getWholeUserWorkoutPlanResponseSchema,
  getWholeWorkoutPlanRequest,
} from './plan.schemas';

export type GetWholeUserWorkoutPlanQuery = z.infer<typeof getWholeWorkoutPlanRequest.shape.query>;
export type GetWholeUserWorkoutPlanResponse = z.infer<typeof getWholeUserWorkoutPlanResponseSchema>;

export type AddWorkoutBody = z.infer<typeof addWorkoutRequest.shape.body>;
export type AddWorkoutResponse = z.infer<typeof addWorkoutResponseSchema>;
