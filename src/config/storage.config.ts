import './app.config';

export const awsConfig = {
  region: process.env.AWS_REGION ?? '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  bucketName: process.env.AWS_BUCKET_NAME,
  s3Endpoint: process.env.AWS_S3_ENDPOINT_URL ?? '',
  s3PresignEndpoint: process.env.AWS_S3_PRESIGN_ENDPOINT_URL ?? '',
};

export const supabaseConfig = {
  url: process.env.SUPABASE_URL ?? '',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE ?? '',
  bucketName: process.env.BUCKET_NAME ?? '',
};
