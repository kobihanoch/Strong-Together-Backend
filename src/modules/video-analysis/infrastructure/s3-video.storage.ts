import { Injectable } from '@nestjs/common';
import { S3Service } from '../../../infrastructure/aws/s3/s3.service';
import { VideoStorage } from '../application/ports/video-storage.port';

/** S3-backed storage for video-analysis uploads. */
@Injectable()
export class S3VideoStorage implements VideoStorage {
  constructor(private readonly s3Service: S3Service) {}

  createUploadUrl(fileKey: string, fileType: string, metadata: Record<string, string>): Promise<string> {
    return this.s3Service.getUploadUrl(fileKey, fileType, metadata);
  }
}
