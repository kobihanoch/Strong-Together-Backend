import { z } from 'zod';

const workoutExerciseSchema = z.object({
  id: z.number(),
  sets: z.union([z.number(), z.array(z.number())]),
  order_index: z.number().optional(),
});

const addWorkoutSplitPayloadSchema = z.record(z.string(), z.array(workoutExerciseSchema));

export const addWorkoutRequest = z.object({
  body: z.object({
    workoutData: addWorkoutSplitPayloadSchema,
    workoutName: z.string().optional(),
    tz: z.string(),
  }),
});
