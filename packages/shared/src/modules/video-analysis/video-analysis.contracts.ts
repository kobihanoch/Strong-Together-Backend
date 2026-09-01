import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { exerciseDbSchema } from '../../database';

// Get presigned S3 upload URL

export const createVideoUploadUrlRequestSchema = z.object({
  body: z.object({ exercise: exerciseDbSchema.shape.name, fileType: z.string(), jobId: z.string() }),
});
export const createVideoUploadUrlResponseSchema = z.object({
  uploadUrl: z.string(),
  fileKey: z.string(),
  requestId: z.string(),
});

export const createVideoUploadUrlContract = {
  request: createVideoUploadUrlRequestSchema,
  response: createVideoUploadUrlResponseSchema,
} satisfies Contract;

export type CreateVideoUploadUrlBody = BodyOf<typeof createVideoUploadUrlContract>;
export type CreateVideoUploadUrlResponse = ResponseOf<typeof createVideoUploadUrlContract>;
