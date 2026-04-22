import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../../app';

let app: Awaited<ReturnType<typeof createApp>>;

beforeAll(async () => {
  app = await createApp();
}, 30000);

describe('GoogleController', () => {
  it('POST /api/oauth/google rejects missing idToken with 400', async () => {
    const response = await request(app.getHttpServer()).post('/api/oauth/google').set('x-app-version', '4.5.0').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing google id token');
  });

  it('POST /api/oauth/google rejects malformed idToken with 401 or 500 from real provider verification path', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/oauth/google')
      .set('x-app-version', '4.5.0')
      .send({ idToken: 'not-a-google-token' });

    expect([400, 401, 500]).toContain(response.status);
    expect(response.body.message).toBeDefined();
  });
});
