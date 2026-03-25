import { z } from 'zod';
import { wholeUserWorkoutPlanSchema, workoutSplitsMapSchema } from '../shared/responseSchemas.ts';

export const getWholeUserWorkoutPlanResponseSchema = z.object({
  workoutPlan: wholeUserWorkoutPlanSchema.nullable(),
  workoutPlanForEditWorkout: workoutSplitsMapSchema.nullable(),
});
