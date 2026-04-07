import z from 'zod';
import { getPresignedUrlFromS3ResponseSchema } from '../../../../modules/video-analysis/video-analysis.schemas.ts';

export type GetPresignedUrlFromS3Response = z.infer<typeof getPresignedUrlFromS3ResponseSchema>;
