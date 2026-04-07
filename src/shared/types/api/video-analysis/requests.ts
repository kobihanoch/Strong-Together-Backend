import z from 'zod';
import { getPresignedUrlS3Request } from '../../../../modules/video-analysis/video-analysis.schemas.ts';

export type GetPresignedUrlFromS3Body = z.infer<typeof getPresignedUrlS3Request.shape.body>;
