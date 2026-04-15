import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import type {
  AnalyzeVideoResultPayload,
  GetPresignedUrlFromS3Response,
  SquatRepetition,
} from '@strong-together/shared';
import { getUploadUrl } from '../../infrastructure/aws/s3.service.ts';
import { UserEntity } from '@strong-together/shared';
import { getIO } from '../../infrastructure/socket.io.ts';

export const normalizeHeaderValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value.join(',');
  }

  return value || '';
};

@Injectable()
export class VideoAnalysisService {
  async getPresignedUrlData({
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
  }): Promise<{ payload: GetPresignedUrlFromS3Response; fileKey: string }> {
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
  }

  emitVideoAnalysisResults = (userId: UserEntity['id'], results: AnalyzeVideoResultPayload<SquatRepetition>) => {
    try {
      getIO().to(userId).emit(`video_analysis_results`, results);
    } catch (error) {
      if (error instanceof Error && error.message === 'Socket.IO not initialized!') {
        return;
      }

      throw error;
    }
  };

  normalizeHeaderValue = normalizeHeaderValue;
}
