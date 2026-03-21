import { z } from 'zod';

export const publishVideoAnalysisJobRequest = z.object({
  body: z.object({
    fileKey: z.string(),
    exercise: z.string(),
  }),
});
