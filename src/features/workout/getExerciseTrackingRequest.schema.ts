import { z } from 'zod';

export const getExerciseTrackingRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});
