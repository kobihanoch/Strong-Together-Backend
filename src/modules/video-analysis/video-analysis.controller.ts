import { Request, Response } from 'express';
import { createLogger } from '../../infrastructure/logger.ts';
import { getPresignedUrlData, normalizeHeaderValue } from './video-analysis.service.ts';
import { GetPresignedUrlFromS3Body } from '../../shared/types/api/video-analysis/requests.ts';
import { GetPresignedUrlFromS3Response } from '../../shared/types/api/video-analysis/responses.ts';

const logger = createLogger('controller:video-analysis');

/**
 * Generate a presigned upload URL for a video-analysis job.
 *
 * Creates a unique file key, forwards tracing metadata into S3 object
 * metadata, and returns the upload URL the client should use for direct video
 * upload.
 *
 * Route: POST /api/videoanalysis/getpresignedurl
 * Access: User
 */
export const getPresignedUrlFromS3 = async (
  req: Request<{}, GetPresignedUrlFromS3Response, GetPresignedUrlFromS3Body>,
  res: Response<GetPresignedUrlFromS3Response>,
): Promise<Response<GetPresignedUrlFromS3Response>> => {
  const { exercise, fileType, jobId } = req.body;
  const userId = req.user!.id;
  const requestId = req.requestId;
  const requestLogger = req.logger || logger;
  const sentryTrace = normalizeHeaderValue(req.headers['sentry-trace']);
  const baggage = normalizeHeaderValue(req.headers['baggage']);
  const { payload, fileKey } = await getPresignedUrlData({
    exercise,
    fileType,
    jobId,
    userId,
    requestId,
    sentryTrace,
    baggage,
  });
  requestLogger.info(
    { event: 'video_analysis.upload_url_generated', fileKey, fileType, jobId, requestId, userId },
    'Generated presigned upload URL for video analysis',
  );

  return res.status(200).json(payload);
};
