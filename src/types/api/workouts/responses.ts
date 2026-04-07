import z from 'zod';
import {
  addWorkoutResponseSchema,
  getWholeUserWorkoutPlanResponseSchema,
} from '../../../modules/workout/plan/workout.plan.schemas.ts';
import {
  finishUserWorkoutResponseSchema,
  getExerciseTrackingResponseSchema,
} from '../../../modules/workout/tracking/workout.tracking.schemas.ts';

export type GetWholeUserWorkoutPlanResponse = z.infer<typeof getWholeUserWorkoutPlanResponseSchema>;
export type GetExerciseTrackingResponse = z.infer<typeof getExerciseTrackingResponseSchema>;
export type FinishUserWorkoutResponse = z.infer<typeof finishUserWorkoutResponseSchema>;
export type AddWorkoutResponse = z.infer<typeof addWorkoutResponseSchema>;
