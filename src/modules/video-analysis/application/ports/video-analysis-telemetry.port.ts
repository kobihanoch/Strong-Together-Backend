import type { CreateVideoUploadInput } from '../models/video-analysis.models';

/** Records tracing attributes for video-analysis upload creation. */
export abstract class VideoAnalysisTelemetry {
  abstract recordUpload(input: CreateVideoUploadInput, fileKey: string): void;
}
