import { z } from 'zod/v4';
import { userDbSchema } from '../../database';

/** Parameters used to enqueue a video-analysis job. */
export const enqueueAnalyzeVideoParamsDtoSchema = z.object({
  fileKey: z.string(),
  exercise: z.string(),
  userId: userDbSchema.shape.id,
  requestId: z.string(),
  sentryTrace: z.string().optional(),
  baggage: z.string().optional(),
});

/** Queue payload containing video-analysis parameters and expiration. */
export const analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({
  expiresAt: z.number(),
});

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

/** Completed-or-failed result payload emitted by a video-analysis worker. */
export const analyzeVideoResultPayloadDtoSchema = <TResultSchema extends z.ZodType>(resultSchema: TResultSchema) =>
  z.intersection(
    z.object({
      jobId: z.string(),
      userId: userDbSchema.shape.id,
      exercise: z.string(),
      requestId: z.string().optional(),
    }),
    z.discriminatedUnion('status', [
      z.object({ status: z.literal('completed'), result: z.array(resultSchema), error: z.null() }),
      z.object({ status: z.literal('failed'), result: z.null(), error: z.string() }),
    ]),
  );

export type EnqueueAnalyzeVideoParamsDto = z.infer<typeof enqueueAnalyzeVideoParamsDtoSchema>;
export type AnalyzeVideoPayloadDto = z.infer<typeof analyzeVideoPayloadDtoSchema>;
export type SquatRepetitionDto = z.infer<typeof squatRepetitionDtoSchema>;
export type AnalyzeVideoResultPayloadDto<TResult> = z.infer<
  ReturnType<typeof analyzeVideoResultPayloadDtoSchema<z.ZodType<TResult>>>
>;
