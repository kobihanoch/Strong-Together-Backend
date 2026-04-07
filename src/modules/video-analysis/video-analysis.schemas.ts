import { z } from 'zod';

export const getPresignedUrlS3Request = z.object({
  body: z.object({
    exercise: z.string(),
    fileType: z.string(),
    jobId: z.string(),
  }),
});

export const getPresignedUrlFromS3ResponseSchema = z.object({
  uploadUrl: z.string(),
  fileKey: z.string(),
  requestId: z.string(),
});
