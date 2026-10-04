import type { VideoUploadResult } from '../../models/video-analysis.models';
import { VideoAnalysisTelemetry } from '../../ports/video-analysis-telemetry.port';
import { VideoStorage } from '../../ports/video-storage.port';
import { VideoUploadRequest } from '../../../domain/entities/video-upload-request';
import { CreateVideoUploadUrlCommand } from './create-video-upload-url.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Creates direct upload URLs for video-analysis jobs. */
@CommandHandler(CreateVideoUploadUrlCommand)
export class CreateVideoUploadUrlHandler implements ICommandHandler<CreateVideoUploadUrlCommand> {
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
  async execute(command: CreateVideoUploadUrlCommand): Promise<VideoUploadResult> {
    const { input } = command;
    const request = VideoUploadRequest.create(input);
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
