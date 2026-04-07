import { z } from 'zod';
import { wholeUserWorkoutPlanSchema, workoutSplitsMapSchema } from '../../../validators/shared/responseSchemas.ts';

const workoutExerciseSchema = z.object({
  id: z.number(),
  sets: z.array(z.number()),
  order_index: z.number(),
});

const addWorkoutSplitPayloadSchema = z.record(
  z.string(),
  z.array(workoutExerciseSchema).min(1, 'Each split must include at least one exercise'),
);

export const addWorkoutRequest = z.object({
  body: z.object({
    workoutData: addWorkoutSplitPayloadSchema,
    workoutName: z.string().optional(),
    tz: z.string(),
  }),
});

export const addWorkoutResponseSchema = z.object({
  message: z.string(),
  workoutPlan: wholeUserWorkoutPlanSchema,
  workoutPlanForEditWorkout: workoutSplitsMapSchema,
});

export const getWholeWorkoutPlanRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});

export const getWholeUserWorkoutPlanResponseSchema = z.object({
  workoutPlan: wholeUserWorkoutPlanSchema.nullable(),
  workoutPlanForEditWorkout: workoutSplitsMapSchema.nullable(),
});
