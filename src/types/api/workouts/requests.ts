import z from 'zod';
import { addWorkoutRequest } from '../../../validators/workouts/addWorkoutRequest.schema.ts';
import { finishWorkoutRequest } from '../../../validators/workouts/finishUserWorkoutRequest.schema.ts';
import { getExerciseTrackingRequest } from '../../../validators/workouts/getExerciseTrackingRequest.schema.ts';
import { getWholeWorkoutPlanRequest } from '../../../validators/workouts/getWholeUserWorkoutPlanRequest.schema.ts';

export type GetWholeUserWorkoutPlanQuery = z.infer<typeof getWholeWorkoutPlanRequest.shape.query>;
export type GetExerciseTrackingQuery = z.infer<typeof getExerciseTrackingRequest.shape.query>;
export type FinishUserWorkoutBody = z.infer<typeof finishWorkoutRequest.shape.body>;
export type AddWorkoutBody = z.infer<typeof addWorkoutRequest.shape.body>;
