import z from 'zod';
import { publishVideoAnalysisJobRequest } from '../../../validators/videoAnalysis/publishVideoAnalysisJobRequest.schema.ts';
import { getPresignedUrlS3Request } from '../../../validators/videoAnalysis/getPresignedUrlFromS3Request.schema.ts';

export type PublishVideoAnalysisJobBody = z.infer<typeof publishVideoAnalysisJobRequest.shape.body>;
export type GetPresignedUrlFromS3Body = z.infer<typeof getPresignedUrlS3Request.shape.body>;
