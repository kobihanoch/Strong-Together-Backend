import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import type { CreateVideoUploadInput } from '../application/models/video-analysis.models';
import { VideoAnalysisTelemetry } from '../application/ports/video-analysis-telemetry.port';

/** Sentry-backed tracing for video-analysis uploads. */
@Injectable()
export class SentryVideoAnalysisTelemetry implements VideoAnalysisTelemetry {
  recordUpload(input: CreateVideoUploadInput, fileKey: string): void {
    Sentry.getActiveSpan()?.setAttributes({
      'video_analysis.job_id': input.jobId,
      'http.request_id': input.requestId,
      'enduser.id': input.userId,
      'file.key': fileKey,
      'file.type': input.fileType,
      'video.exercise': input.exercise,
    });
  }
}
