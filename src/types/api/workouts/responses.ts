import z from 'zod';
import { getWholeUserWorkoutPlanResponseSchema } from '../../../validators/workouts/getWholeUserWorkoutPlanResponse.schema.ts';
import { getExerciseTrackingResponseSchema } from '../../../validators/workouts/getExerciseTrackingResponse.schema.ts';
import { finishUserWorkoutResponseSchema } from '../../../validators/workouts/finishUserWorkoutResponse.schema.ts';
import { addWorkoutResponseSchema } from '../../../validators/workouts/addWorkoutResponse.schema.ts';

export type GetWholeUserWorkoutPlanResponse = z.infer<typeof getWholeUserWorkoutPlanResponseSchema>;
export type GetExerciseTrackingResponse = z.infer<typeof getExerciseTrackingResponseSchema>;
export type FinishUserWorkoutResponse = z.infer<typeof finishUserWorkoutResponseSchema>;
export type AddWorkoutResponse = z.infer<typeof addWorkoutResponseSchema>;
