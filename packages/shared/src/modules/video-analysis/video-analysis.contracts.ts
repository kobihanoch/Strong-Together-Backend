import z from 'zod/v4';
import { getPresignedUrlFromS3ResponseSchema, getPresignedUrlS3Request } from './video-analysis.schemas';

export type GetPresignedUrlFromS3Body = z.infer<typeof getPresignedUrlS3Request.shape.body>;
export type GetPresignedUrlFromS3Response = z.infer<typeof getPresignedUrlFromS3ResponseSchema>;
