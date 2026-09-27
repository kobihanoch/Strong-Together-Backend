import { Injectable } from '@nestjs/common';
import type { CreateVideoUploadInput, VideoUploadResult } from '../models/video-analysis.models';
import { VideoAnalysisTelemetry } from '../ports/video-analysis-telemetry.port';
import { VideoStorage } from '../ports/video-storage.port';
import { VideoUploadRequest } from '../../domain/entities/video-upload-request';

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
    const request = new VideoUploadRequest(input);
    const fileKey = request.fileKey(Date.now());
    const requestId = request.requestId || '';
    this.telemetry.recordUpload(request, fileKey);

    const uploadUrl = await this.storage.createUploadUrl(fileKey, request.fileType, {
      sentry_trace: request.sentryTrace,
      baggage: request.baggage,
      job_id: request.jobId || 'unknown',
      request_id: requestId,
      user_id: request.userId,
      exercise: request.exercise.value,
    });

    return { payload: { uploadUrl, fileKey, requestId }, fileKey };
  }
}
