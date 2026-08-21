import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { exerciseDbSchema } from '../../database';

// Get presigned S3 upload URL

export const getPresignedUrlFromS3RequestSchema = z.object({
  body: z.object({ exercise: exerciseDbSchema.shape.name, fileType: z.string(), jobId: z.string() }),
});
export const getPresignedUrlFromS3ResponseSchema = z.object({
  uploadUrl: z.string(),
  fileKey: z.string(),
  requestId: z.string(),
});

export const getPresignedUrlFromS3Contract = {
  request: getPresignedUrlFromS3RequestSchema,
  response: getPresignedUrlFromS3ResponseSchema,
} satisfies Contract;

export type GetPresignedUrlFromS3Body = BodyOf<typeof getPresignedUrlFromS3Contract>;
export type GetPresignedUrlFromS3Response = ResponseOf<typeof getPresignedUrlFromS3Contract>;
