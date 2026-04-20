import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { awsConfig } from '../../../config/storage.config';
import { appConfig } from '../../../config/app.config';

@Injectable()
export class S3Service implements OnModuleDestroy {
  private s3Client: S3Client;
  constructor(s3Client: S3Client) {
    this.s3Client = s3Client;
  }
  async getUploadUrl(fileKey: string, fileType: string, metadata: Record<string, string>): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: fileKey,
      ContentType: fileType,
      Metadata: metadata,
    });

    // URL will be valid for 5 minutes (300 seconds)
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

    // Prod
    if (appConfig.isProduction && !awsConfig.s3PresignEndpoint) {
      return url;
    } else {
      const resolvedUrl = new URL(url);
      const publicEndpoint = new URL(awsConfig.s3PresignEndpoint);
      resolvedUrl.protocol = publicEndpoint.protocol;
      resolvedUrl.host = publicEndpoint.host;
      return resolvedUrl.toString();
    }
  }

  async onModuleDestroy() {
    this.s3Client.destroy();
  }
}
