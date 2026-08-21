import { Module } from '@nestjs/common';
import { S3Service } from './s3/s3.service';
import { awsConfig } from '../../config/storage.config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT } from './aws.tokens';

@Module({
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: () => {
        const clientConfig = {
          region: awsConfig.region,
          credentials: {
            accessKeyId: awsConfig.accessKeyId,
            secretAccessKey: awsConfig.secretAccessKey,
          },
          ...(awsConfig.s3Endpoint
            ? {
                endpoint: awsConfig.s3Endpoint,
                forcePathStyle: true,
              }
            : {}),
        };

        return new S3Client(clientConfig);
      },
    },
    S3Service,
  ],
  exports: [S3Service, S3_CLIENT],
})
export class AWSModule {}
