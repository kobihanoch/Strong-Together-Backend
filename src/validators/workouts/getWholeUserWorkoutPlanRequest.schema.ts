import { z } from 'zod';

export const getWholeWorkoutPlanRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});
