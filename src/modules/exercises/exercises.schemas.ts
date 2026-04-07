import { z } from 'zod';

export const getAllExercisesResponseSchema = z.record(
  z.string(),
  z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      specificTargetMuscle: z.string(),
    }),
  ),
);
