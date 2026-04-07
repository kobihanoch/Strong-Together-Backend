import z from 'zod';
import { addWorkoutRequest, getWholeWorkoutPlanRequest } from '../../../modules/workout/plan/plan.schemas.ts';
import {
  finishWorkoutRequest,
  getExerciseTrackingRequest,
} from '../../../modules/workout/tracking/tracking.schemas.ts';

export type GetWholeUserWorkoutPlanQuery = z.infer<typeof getWholeWorkoutPlanRequest.shape.query>;
export type GetExerciseTrackingQuery = z.infer<typeof getExerciseTrackingRequest.shape.query>;
export type FinishUserWorkoutBody = z.infer<typeof finishWorkoutRequest.shape.body>;
export type AddWorkoutBody = z.infer<typeof addWorkoutRequest.shape.body>;
