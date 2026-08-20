import z from 'zod/v4';
import {
  finishUserWorkoutResponseSchema,
  finishWorkoutRequest,
  getExerciseTrackingRequest,
  getExerciseTrackingResponseSchema,
} from './tracking.schemas';

export type GetExerciseTrackingQuery = z.infer<typeof getExerciseTrackingRequest.shape.query>;
export type GetExerciseTrackingResponse = z.infer<typeof getExerciseTrackingResponseSchema>;

export type FinishUserWorkoutBody = z.infer<typeof finishWorkoutRequest.shape.body>;
export type FinishUserWorkoutResponse = z.infer<typeof finishUserWorkoutResponseSchema>;
