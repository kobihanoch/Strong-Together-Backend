import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../../app.ts';
import { loginResponseSchema } from '../../../modules/auth/session/session.schemas.ts';
import { proceedLoginResponseSchema } from '../../../modules/oauth/oauth.schemas.ts';
import { loginOAuthCompleteUser, loginOAuthIncompleteUser } from '../helpers/auth.ts';
import { expectSchema } from '../helpers/assert-schema.ts';
import { proceedOAuthAuth } from '../helpers/oauth.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('OAuth', () => {
  // login oauth-complete fixture -> proceedauth -> assert tokens are issued
  it('completes proceedauth for an oauth user with no missing fields', async () => {
    const loginResponse = await loginOAuthCompleteUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await proceedOAuthAuth(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(proceedLoginResponseSchema, response.body);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toBeTypeOf('string');
    expect(response.body.accessToken).toBeTypeOf('string');
    expect(response.body.refreshToken).toBeTypeOf('string');
  });

  // login oauth-incomplete fixture -> proceedauth -> assert profile completion conflict
  it('rejects proceedauth when oauth profile is still incomplete', async () => {
    const loginResponse = await loginOAuthIncompleteUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await proceedOAuthAuth(app, accessToken);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Profile not completed yet');
  });

  // proceedauth without token -> assert 401
  it('rejects proceedauth without token', async () => {
    const response = await request(app).post('/api/oauth/proceedauth').set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

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
