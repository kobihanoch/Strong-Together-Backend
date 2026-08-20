import { z } from 'zod/v4';
import { userDbSchema } from '../../database';

export const enqueueAanalyzeVideoParamsSchema = z.object({
  fileKey: z.string(),
  exercise: z.string(),
  userId: userDbSchema.shape.id,
  requestId: z.string(),
  sentryTrace: z.string().optional(),
  baggage: z.string().optional(),
});

export const analyzeVideoPayloadSchema = enqueueAanalyzeVideoParamsSchema.extend({
  expiresAt: z.number(),
});

export const squatRepetitionSchema = z.object({
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

export const analyzeVideoResultPayloadSchema = <TResultSchema extends z.ZodType>(resultSchema: TResultSchema) =>
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

export type EnqueueAanalyzeVideoParams = z.infer<typeof enqueueAanalyzeVideoParamsSchema>;
export type AnalyzeVideoPayload = z.infer<typeof analyzeVideoPayloadSchema>;
export type SquatRepetition = z.infer<typeof squatRepetitionSchema>;
export type AnalyzeVideoResultPayload<TResult> = z.infer<
  ReturnType<typeof analyzeVideoResultPayloadSchema<z.ZodType<TResult>>>
>;
