import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { getPresignedUrlFromS3ResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import {
  deleteUploadedObject,
  ensureAnalysisQueue,
  ensureS3Bucket,
  headUploadedObject,
  purgeAnalysisQueue,
  receiveAnalysisQueueMessage,
} from '../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';
import { awsConfig } from '../../config/storage.config';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const uploadedKeys = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

beforeEach(async () => {
  await ensureS3Bucket(awsConfig.bucketName as string);
  await ensureAnalysisQueue(awsConfig.bucketName);
  await purgeAnalysisQueue();
});

afterEach(async () => {
  await Promise.all([...uploadedKeys].map((key) => deleteUploadedObject(key).catch(() => undefined)));
  await cleanupTestUsers(users);
  uploadedKeys.clear();
  users.clear();
});

describe('VideoAnalysisController', () => {
  it('POST /api/videoanalysis/getpresignedurl returns schema, uploads to LocalStack S3, and emits SQS event', async () => {
    const user = await createAndLoginTestUser(app, 'video');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);

    const response = await request(app.getHttpServer())
      .post('/api/videoanalysis/getpresignedurl')
      .set(authHeaders(user.accessToken))
      .send({ exercise: 'Squat', fileType: 'video/mp4', jobId: 'controller-job-id' });

    expect(response.status).toBe(201);
    expectSchema(getPresignedUrlFromS3ResponseSchema, response.body);
    expect(response.body.fileKey).toContain(`Squat_${user.userId}_`);
    uploadedKeys.add(response.body.fileKey);

    const upload = await fetch(response.body.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'video/mp4' },
      body: Buffer.from('fake-video-binary'),
    });
    expect(upload.ok).toBe(true);

    const object = await headUploadedObject(response.body.fileKey);
    expect(object.ContentType).toBe('video/mp4');
    expect(object.Metadata).toMatchObject({
      exercise: 'Squat',
      job_id: 'controller-job-id',
      user_id: user.userId,
    });

    const sqsMessage = await receiveAnalysisQueueMessage();
    expect(sqsMessage?.Body).toContain(response.body.fileKey);
  });

  it('POST /api/videoanalysis/getpresignedurl rejects bad payloads with 400 and no auth with 401', async () => {
    const user = await createAndLoginTestUser(app, 'video_bad');
    users.add(user.username);
    const bad = await request(app.getHttpServer())
      .post('/api/videoanalysis/getpresignedurl')
      .set(authHeaders(user.accessToken))
      .send({ exercise: 'Squat', fileType: 'video/mp4' });
    const noAuth = await request(app.getHttpServer())
      .post('/api/videoanalysis/getpresignedurl')
      .set('x-app-version', '4.5.0')
      .send({ exercise: 'Squat', fileType: 'video/mp4', jobId: 'job' });

    expect(bad.status).toBe(400);
    expect(noAuth.status).toBe(401);
  });
});
