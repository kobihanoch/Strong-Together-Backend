import * as Sentry from '@sentry/node';
import { getUploadUrl } from '../../aws/s3/s3Utils.ts';
import type { GetPresignedUrlFromS3Response } from '../../types/api/videoAnalysis/responses.ts';

export const normalizeHeaderValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value.join(',');
  }

  return value || '';
};

export const getPresignedUrlData = async ({
  exercise,
  fileType,
  jobId,
  userId,
  requestId,
  sentryTrace,
  baggage,
}: {
  exercise: string;
  fileType: string;
  jobId: string;
  userId: string;
  requestId?: string;
  sentryTrace: string;
  baggage: string;
}): Promise<{ payload: GetPresignedUrlFromS3Response; fileKey: string }> => {
  const fileKey = `${exercise}_${userId}_${Date.now()}`;
  const resolvedRequestId = requestId || '';

  const metadata = {
    sentry_trace: sentryTrace,
    baggage,
    job_id: jobId || 'unknown',
    request_id: resolvedRequestId,
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

  return {
    payload: {
      uploadUrl,
      fileKey,
      requestId: resolvedRequestId,
    },
    fileKey,
  };
};
