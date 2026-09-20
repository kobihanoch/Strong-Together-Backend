import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';

// Get presigned S3 upload URL

export const createVideoUploadUrlRequestSchema = z.object({
  body: z.object({ exercise: z.string(), fileType: z.string(), jobId: z.string() }),
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

/** Parameters used to enqueue a video-analysis job. */
export const enqueueAnalyzeVideoParamsDtoSchema = z.object({
  fileKey: z.string(),
  exercise: z.string(),
  userId: z.string().uuid(),
  requestId: z.string(),
  sentryTrace: z.string().optional(),
  baggage: z.string().optional(),
});

/** Queue payload containing video-analysis parameters and expiration. */
export const analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({ expiresAt: z.number() });

/** Analysis result for one detected squat repetition. */
export const squatRepetitionDtoSchema = z.object({
  depth: z.object({ value: z.number(), status: z.string(), confidence: z.number() }),
  backLean: z.object({ value: z.number(), excessive: z.boolean(), confidence: z.number() }),
  audit: z.object({
    framesAnalyzed: z.number(),
    validFrames: z.number(),
    cameraAngle: z.string(),
    rawBottomAngle: z.number(),
    samplingRate: z.string(),
  }),
});

/** Completed-or-failed result emitted by a video-analysis worker. */
export const analyzeVideoResultPayloadDtoSchema = <TResultSchema extends z.ZodType>(resultSchema: TResultSchema) =>
  z.intersection(
    z.object({ jobId: z.string(), userId: z.string().uuid(), exercise: z.string(), requestId: z.string().optional() }),
    z.discriminatedUnion('status', [
      z.object({ status: z.literal('completed'), result: z.array(resultSchema), error: z.null() }),
      z.object({ status: z.literal('failed'), result: z.null(), error: z.string() }),
    ]),
  );

export type EnqueueAnalyzeVideoParamsDto = z.infer<typeof enqueueAnalyzeVideoParamsDtoSchema>;
export type AnalyzeVideoPayloadDto = z.infer<typeof analyzeVideoPayloadDtoSchema>;
export type SquatRepetitionDto = z.infer<typeof squatRepetitionDtoSchema>;
export type AnalyzeVideoResultPayloadDto<TResult> = z.infer<ReturnType<typeof analyzeVideoResultPayloadDtoSchema<z.ZodType<TResult>>>>;
