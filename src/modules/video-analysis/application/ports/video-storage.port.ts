/** Creates upload URLs for video-analysis source files. */
export abstract class VideoStorage {
  abstract createUploadUrl(fileKey: string, fileType: string, metadata: Record<string, string>): Promise<string>;
}
