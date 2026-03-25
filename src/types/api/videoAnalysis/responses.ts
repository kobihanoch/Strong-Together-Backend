import z from 'zod';
import { publishVideoAnalysisJobResponseSchema } from '../../../validators/videoAnalysis/publishVideoAnalysisJobResponse.schema.ts';
import { getPresignedUrlFromS3ResponseSchema } from '../../../validators/videoAnalysis/getPresignedUrlFromS3Response.schema.ts';

export type PublishVideoAnalysisJobResponse = z.infer<typeof publishVideoAnalysisJobResponseSchema>;
export type GetPresignedUrlFromS3Response = z.infer<typeof getPresignedUrlFromS3ResponseSchema>;
