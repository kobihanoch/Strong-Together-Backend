import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../app.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('OAuth', () => {
  // post google oauth without id token -> assert controller-level validation error
  it('rejects google oauth when idToken is missing', async () => {
    const response = await request(app).post('/api/oauth/google').set('x-app-version', '4.5.0').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing google id token');
  });

  // post apple oauth without identity token -> assert controller-level validation error
  it('rejects apple oauth when idToken is missing', async () => {
    const response = await request(app).post('/api/oauth/apple').set('x-app-version', '4.5.0').send({
      email: 'apple_oauth_test@example.com',
      rawNonce: 'nonce-123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing or invalid Apple identityToken');
  });

  // post apple oauth with invalid email shape -> assert request validation error
  it('rejects apple oauth with invalid email payload', async () => {
    const response = await request(app).post('/api/oauth/apple').set('x-app-version', '4.5.0').send({
      email: 'not-an-email',
      rawNonce: 'nonce-123',
      idToken: 'dummy-token',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email address');
  });
});

