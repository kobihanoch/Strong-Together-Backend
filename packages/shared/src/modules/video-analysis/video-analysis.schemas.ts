import { z } from 'zod/v4';
import { exerciseDbSchema } from '../../database';

export const getPresignedUrlS3Request = z.object({
  body: z.object({
    exercise: exerciseDbSchema.shape.name,
    fileType: z.string(),
    jobId: z.string(),
  }),
});

export const getPresignedUrlFromS3ResponseSchema = z.object({
  uploadUrl: z.string(),
  fileKey: z.string(),
  requestId: z.string(),
});
