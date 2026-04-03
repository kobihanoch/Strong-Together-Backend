import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { getUploadUrl } from '../aws/s3/s3Utils.ts';
import { createLogger } from '../config/logger.ts';

import { GetPresignedUrlFromS3Body } from '../types/api/videoAnalysis/requests.ts';
import { GetPresignedUrlFromS3Response } from '../types/api/videoAnalysis/responses.ts';

const logger = createLogger('controller:video-analysis');

const normalizeHeaderValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value.join(',');
  }

  return value || '';
};

// @desc    Get presigned URL from AWS S3
// @route   POST /api/videoanalysis/getpresignedurl
// @access  Private
export const getPresignedUrlFromS3 = async (
  req: Request<{}, GetPresignedUrlFromS3Response, GetPresignedUrlFromS3Body>,
  res: Response<GetPresignedUrlFromS3Response>,
): Promise<Response<GetPresignedUrlFromS3Response>> => {
  const { exercise, fileType, jobId } = req.body;
  const userId = req.user!.id;
  const requestId = req.requestId;
  const fileKey = `${exercise}_${userId}_${Date.now()}`;
  const requestLogger = req.logger || logger;
  const sentryTrace = normalizeHeaderValue(req.headers['sentry-trace']);
  const baggage = normalizeHeaderValue(req.headers['baggage']);

  const metadata = {
    sentry_trace: sentryTrace,
    baggage,
    job_id: jobId || 'unknown',
    request_id: requestId,
    user_id: userId,
    exercise,
  };

  Sentry.getActiveSpan()?.setAttributes({
    'video_analysis.job_id': jobId,
    'http.request_id': requestId,
    'enduser.id': userId,
    'file.key': fileKey,
    'file.type': fileType,
    'video.exercise': exercise,
  });

  const uploadUrl = await getUploadUrl(fileKey, fileType, metadata);
  requestLogger.info(
    { event: 'video_analysis.upload_url_generated', fileKey, fileType, jobId, requestId, userId },
    'Generated presigned upload URL for video analysis',
  );

  return res.status(200).json({
    uploadUrl,
    fileKey,
    requestId,
  });
};
