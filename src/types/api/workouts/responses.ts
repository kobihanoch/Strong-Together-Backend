import z from 'zod';
import { getWholeUserWorkoutPlanResponseSchema } from '../../../features/workout/getWholeUserWorkoutPlanResponse.schema.ts';
import { getExerciseTrackingResponseSchema } from '../../../features/workout/getExerciseTrackingResponse.schema.ts';
import { finishUserWorkoutResponseSchema } from '../../../features/workout/finishUserWorkoutResponse.schema.ts';
import { addWorkoutResponseSchema } from '../../../features/workout/addWorkoutResponse.schema.ts';

export type GetWholeUserWorkoutPlanResponse = z.infer<typeof getWholeUserWorkoutPlanResponseSchema>;
export type GetExerciseTrackingResponse = z.infer<typeof getExerciseTrackingResponseSchema>;
export type FinishUserWorkoutResponse = z.infer<typeof finishUserWorkoutResponseSchema>;
export type AddWorkoutResponse = z.infer<typeof addWorkoutResponseSchema>;
