import z from 'zod';
import { addWorkoutRequest } from '../../../features/workout/addWorkoutRequest.schema.ts';
import { finishWorkoutRequest } from '../../../features/workout/finishUserWorkoutRequest.schema.ts';
import { getExerciseTrackingRequest } from '../../../features/workout/getExerciseTrackingRequest.schema.ts';
import { getWholeWorkoutPlanRequest } from '../../../features/workout/getWholeUserWorkoutPlanRequest.schema.ts';

export type GetWholeUserWorkoutPlanQuery = z.infer<typeof getWholeWorkoutPlanRequest.shape.query>;
export type GetExerciseTrackingQuery = z.infer<typeof getExerciseTrackingRequest.shape.query>;
export type FinishUserWorkoutBody = z.infer<typeof finishWorkoutRequest.shape.body>;
export type AddWorkoutBody = z.infer<typeof addWorkoutRequest.shape.body>;
