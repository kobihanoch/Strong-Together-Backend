import z from 'zod';
import { getPresignedUrlFromS3ResponseSchema } from '../../../features/videoAnalysis/getPresignedUrlFromS3Response.schema.ts';

export type GetPresignedUrlFromS3Response = z.infer<typeof getPresignedUrlFromS3ResponseSchema>;
