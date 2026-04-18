import './app.config';

export const awsConfig = {
  region: process.env.AWS_REGION ?? '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  bucketName: process.env.AWS_BUCKET_NAME,
};

export const supabaseConfig = {
  url: process.env.SUPABASE_URL ?? '',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE ?? '',
  bucketName: process.env.BUCKET_NAME ?? '',
};
