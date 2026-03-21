import { z } from 'zod';

export const getPresignedUrlS3Request = z.object({
  body: z.object({
    fileName: z.string(),
    fileType: z.string(),
  }),
});
