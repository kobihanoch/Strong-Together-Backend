import { z } from 'zod';

export const publishVideoAnalysisJobResponseSchema = z.object({
  jobId: z.string(),
});
