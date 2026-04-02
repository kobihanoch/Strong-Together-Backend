import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function getUploadUrl(
  fileKey: string,
  fileType: string,
  metadata: Record<string, string>,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
    Metadata: metadata,
  });

  // URL will be valid for 5 minutes (300 seconds)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return url;
}
