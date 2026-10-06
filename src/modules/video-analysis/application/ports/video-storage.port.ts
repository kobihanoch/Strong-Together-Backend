import type { VideoFileType } from '../../domain/value-objects/video-file-type';

/** Creates upload URLs for video-analysis source files. */
export abstract class VideoStorage {
  abstract createUploadUrl(fileKey: string, fileType: VideoFileType, metadata: Record<string, string>): Promise<string>;
}
