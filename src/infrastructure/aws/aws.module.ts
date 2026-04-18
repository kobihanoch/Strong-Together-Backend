import { Module } from '@nestjs/common';
import { S3Service } from './s3/s3.service';
import { awsConfig } from '../../config/storage.config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: awsConfig.region,
          credentials: {
            accessKeyId: awsConfig.accessKeyId,
            secretAccessKey: awsConfig.secretAccessKey,
          },
        });
      },
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class AWSModule {}
