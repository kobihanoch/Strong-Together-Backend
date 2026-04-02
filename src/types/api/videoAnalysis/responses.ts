import z from 'zod';
import { getPresignedUrlFromS3ResponseSchema } from '../../../validators/videoAnalysis/getPresignedUrlFromS3Response.schema.ts';

export type GetPresignedUrlFromS3Response = z.infer<typeof getPresignedUrlFromS3ResponseSchema>;
