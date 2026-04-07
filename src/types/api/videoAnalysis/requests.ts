import z from 'zod';
import { getPresignedUrlS3Request } from '../../../modules/videoAnalysis/videoAnalysis.schemas.ts';

export type GetPresignedUrlFromS3Body = z.infer<typeof getPresignedUrlS3Request.shape.body>;
