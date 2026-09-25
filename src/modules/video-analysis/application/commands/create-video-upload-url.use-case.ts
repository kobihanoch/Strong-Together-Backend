import { Injectable } from '@nestjs/common';
import type { CreateVideoUploadInput, VideoUploadResult } from '../models/video-analysis.models';
import { VideoAnalysisTelemetry } from '../ports/video-analysis-telemetry.port';
import { VideoStorage } from '../ports/video-storage.port';

/** Creates direct upload URLs for video-analysis jobs. */
@Injectable()
export class CreateVideoUploadUrlUseCase {
  constructor(
    private readonly storage: VideoStorage,
    private readonly telemetry: VideoAnalysisTelemetry,
  ) {}

  /**
   * Creates an object key and presigned upload URL with tracing metadata.
   *
   * @param input - The job, user, file, and tracing values.
   * @returns The upload response and generated object key.
   */
  async execute(input: CreateVideoUploadInput): Promise<VideoUploadResult> {
    const fileKey = `${input.exercise}_${input.userId}_${Date.now()}`;
    const requestId = input.requestId || '';
    this.telemetry.recordUpload(input, fileKey);

    const uploadUrl = await this.storage.createUploadUrl(fileKey, input.fileType, {
      sentry_trace: input.sentryTrace,
      baggage: input.baggage,
      job_id: input.jobId || 'unknown',
      request_id: requestId,
      user_id: input.userId,
      exercise: input.exercise,
    });

    return { payload: { uploadUrl, fileKey, requestId }, fileKey };
  }
}
