import type { VideoUploadRequest } from '../../domain/entities/video-upload-request';

/** Records tracing attributes for video-analysis upload creation. */
export abstract class VideoAnalysisTelemetry {
  abstract recordUpload(request: VideoUploadRequest, fileKey: string): void;
}
