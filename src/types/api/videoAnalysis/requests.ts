import z from 'zod';
import { getPresignedUrlS3Request } from '../../../features/videoAnalysis/getPresignedUrlFromS3Request.schema.ts';

export type GetPresignedUrlFromS3Body = z.infer<typeof getPresignedUrlS3Request.shape.body>;
