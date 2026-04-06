import { z } from 'zod';
import { wholeUserWorkoutPlanSchema, workoutSplitsMapSchema } from '../../validators/shared/responseSchemas.ts';

export const addWorkoutResponseSchema = z.object({
  message: z.string(),
  workoutPlan: wholeUserWorkoutPlanSchema,
  workoutPlanForEditWorkout: workoutSplitsMapSchema,
});
