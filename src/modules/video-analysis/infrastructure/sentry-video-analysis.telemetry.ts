import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { VideoAnalysisTelemetry } from '../application/ports/video-analysis-telemetry.port';
import type { VideoUploadRequest } from '../domain/entities/video-upload-request';

/** Sentry-backed tracing for video-analysis uploads. */
@Injectable()
export class SentryVideoAnalysisTelemetry implements VideoAnalysisTelemetry {
  recordUpload(request: VideoUploadRequest, fileKey: string): void {
    Sentry.getActiveSpan()?.setAttributes({
      'video_analysis.job_id': request.jobId,
      'http.request_id': request.requestId,
      'enduser.id': request.userId,
      'file.key': fileKey,
      'file.type': request.fileType.value,
      'video.exercise': request.exercise.value,
    });
  }
}
