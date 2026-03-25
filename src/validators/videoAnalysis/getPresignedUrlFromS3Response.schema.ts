import { z } from 'zod';

export const getPresignedUrlFromS3ResponseSchema = z.object({
  uploadUrl: z.string(),
  fileKey: z.string(),
});
