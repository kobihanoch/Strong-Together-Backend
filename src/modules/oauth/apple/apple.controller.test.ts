import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../../app';

let app: Awaited<ReturnType<typeof createApp>>;

beforeAll(async () => {
  app = await createApp();
}, 30000);

describe('AppleController', () => {
  it('POST /api/oauth/apple rejects missing idToken with 400', async () => {
    const response = await request(app.getHttpServer()).post('/api/oauth/apple').set('x-app-version', '4.5.0').send({
      email: 'apple_oauth_test@example.com',
      rawNonce: 'nonce-123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing or invalid Apple identityToken');
  });

  it('POST /api/oauth/apple rejects invalid email shape with 400', async () => {
    const response = await request(app.getHttpServer()).post('/api/oauth/apple').set('x-app-version', '4.5.0').send({
      email: 'not-an-email',
      rawNonce: 'nonce-123',
      idToken: 'dummy-token',
    });

    expect(response.status).toBe(400);
    expect(response.body.message.toLowerCase()).toContain('invalid email');
  });
});
