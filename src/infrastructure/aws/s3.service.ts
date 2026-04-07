import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsConfig } from '../../config/storage.config.ts';

const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
});

export async function getUploadUrl(
  fileKey: string,
  fileType: string,
  metadata: Record<string, string>,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: awsConfig.bucketName,
    Key: fileKey,
    ContentType: fileType,
    Metadata: metadata,
  });

  // URL will be valid for 5 minutes (300 seconds)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return url;
}
