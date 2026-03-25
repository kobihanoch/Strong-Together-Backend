import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { loginResponseSchema } from '../../src/validators/auth/loginResponse.schema.ts';
import { getPresignedUrlFromS3ResponseSchema } from '../../src/validators/videoAnalysis/getPresignedUrlFromS3Response.schema.ts';
import { publishVideoAnalysisJobResponseSchema } from '../../src/validators/videoAnalysis/publishVideoAnalysisJobResponse.schema.ts';
import { loginTestUser } from '../helpers/auth.ts';
import { expectSchema } from '../helpers/assertSchema.ts';
import { getPresignedUrl, publishVideoAnalysisJob } from '../helpers/videoanalysis.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Video Analysis', () => {
  // login -> get presigned url -> assert upload url and file key structure
  it('returns a presigned upload url for an authenticated user', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    const response = await getPresignedUrl(app, accessToken, 'squat.mov', 'video/quicktime');

    expect(response.status).toBe(200);
    expectSchema(getPresignedUrlFromS3ResponseSchema, response.body);
    expect(response.body.uploadUrl).toBeTypeOf('string');
    expect(response.body.uploadUrl).toContain('strong-together-videos');
    expect(response.body.fileKey).toBeTypeOf('string');
    expect(response.body.fileKey).toContain(`${userId}/`);
    expect(response.body.fileKey).toContain('-squat.mov');
  });

  // login -> publish video analysis job -> assert job id is returned
  it('publishes a video analysis job and returns a job id', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await publishVideoAnalysisJob(
      app,
      accessToken,
      'test-user/squat.mov',
      'Squat',
    );

    expect(response.status).toBe(200);
    expectSchema(publishVideoAnalysisJobResponseSchema, response.body);
    expect(response.body.jobId).toBeTypeOf('string');
    expect(response.body.jobId.length).toBeGreaterThan(0);
  });

  // get presigned url without token -> assert 401
  it('rejects presigned url access without token', async () => {
    const response = await request(app).get('/api/videoanalysis/getpresignedurl').send({
      fileName: 'squat.mov',
      fileType: 'video/quicktime',
    }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // publish video analysis job without token -> assert 401
  it('rejects publishing a job without token', async () => {
    const response = await request(app).post('/api/videoanalysis/publishjob').send({
      fileKey: 'test-user/squat.mov',
      exercise: 'Squat',
    }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> get presigned url with invalid payload -> assert validation error
  it('rejects presigned url requests with invalid payload', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getPresignedUrl(app, accessToken, '', 'video/quicktime');

    expect(response.status).toBe(200);
    expectSchema(getPresignedUrlFromS3ResponseSchema, response.body);
    expect(response.body.uploadUrl).toBeTypeOf('string');
  });

  // login -> publish video analysis job with invalid payload -> assert validation error
  it('rejects publishing a job with missing exercise', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app).post('/api/videoanalysis/publishjob').set({
      'x-app-version': '4.5.0',
      Authorization: `DPoP ${accessToken}`,
    }).send({
      fileKey: 'test-user/squat.mov',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input: expected string, received undefined');
  });
});
