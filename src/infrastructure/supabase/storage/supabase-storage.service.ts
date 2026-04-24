import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { appConfig } from '../../../config/app.config';
import { awsConfig, supabaseConfig } from '../../../config/storage.config';

// Prod - Cloud Supabase storage
const base = supabaseConfig.url;
const svc = supabaseConfig.serviceRole;

// Dev - Localstack
const localStorage = appConfig.isDevelopment || appConfig.isTest;
const s3 = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
  ...(awsConfig.s3Endpoint ? { endpoint: awsConfig.s3Endpoint, forcePathStyle: true } : {}),
});

@Injectable()
export class SupabaseStorageService {
  // In dev/test this writes to LocalStack S3. In prod it keeps using Supabase Storage.
  async uploadBufferToSupabase(
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<{ path: string; publicUrl: string }> {
    // Dev
    if (localStorage) {
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }));
      return {
        path: `${bucket}/${key}`,
        publicUrl: `${awsConfig.s3PresignEndpoint || awsConfig.s3Endpoint}/${bucket}/${key}`,
      };
    }

    // Prod
    const url = `${base}/storage/v1/object/${bucket}/${key}`;

    try {
      await axios.post(url, buffer, {
        headers: {
          'Content-Type': contentType,
          Authorization: `Bearer ${svc}`,
          apikey: svc,
          'x-upsert': 'true',
        },
        maxBodyLength: Infinity,
      });
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }

    // Return the path of image (store in DB) and the public url
    const publicUrl = `${base}/storage/v1/object/public/${bucket}/${key}`;
    return { path: `${bucket}/${key}`, publicUrl };
  }

  // Path format: "<bucket>/<key>".
  async deleteFromSupabase(path: string): Promise<void> {
    if (localStorage) {
      const [bucket, ...keyParts] = path.split('/');
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: keyParts.join('/') }));
      return;
    }

    const url = `${base}/storage/v1/object/${path}`;
    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${svc}`, apikey: svc },
      });
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
