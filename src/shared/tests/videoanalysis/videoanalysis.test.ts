import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../../app.ts';
import { loginResponseSchema } from '../../../modules/auth/session/session.schemas.ts';
import { getPresignedUrlFromS3ResponseSchema } from '../../../modules/video-analysis/video-analysis.schemas.ts';
import { loginBootstrapTestUser } from '../helpers/auth.ts';
import { expectSchema } from '../helpers/assert-schema.ts';
import { getPresignedUrl } from '../helpers/videoanalysis.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Video Analysis', () => {
  // login -> get presigned url -> assert upload url and file key structure
  it('returns a presigned upload url for an authenticated user', async () => {
    const loginResponse = await loginBootstrapTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;
    const jobId = 'test-job-id';

    const response = await getPresignedUrl(app, accessToken, 'Squat', 'video/quicktime', jobId);

    expect(response.status).toBe(200);
    expectSchema(getPresignedUrlFromS3ResponseSchema, response.body);
    expect(response.body.uploadUrl).toBeTypeOf('string');
    expect(response.body.uploadUrl).toContain('strong-together-videos');
    expect(response.body.fileKey).toBeTypeOf('string');
    expect(response.body.fileKey).toContain(`Squat_${userId}_`);
    expect(response.body.requestId).toBeTypeOf('string');
    expect(response.body.requestId.length).toBeGreaterThan(0);
  });

  // get presigned url without token -> assert 401
  it('rejects presigned url access without token', async () => {
    const response = await request(app)
      .post('/api/videoanalysis/getpresignedurl')
      .send({
        exercise: 'Squat',
        fileType: 'video/quicktime',
        jobId: 'test-job-id',
      })
      .set({
        'x-app-version': '4.5.0',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> get presigned url with invalid payload -> assert validation error
  it('rejects presigned url requests with missing jobId', async () => {
    const loginResponse = await loginBootstrapTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app)
      .post('/api/videoanalysis/getpresignedurl')
      .set({
        'x-app-version': '4.5.0',
        Authorization: `DPoP ${accessToken}`,
      })
      .send({
        exercise: 'Squat',
        fileType: 'video/quicktime',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input: expected string, received undefined');
  });
});
