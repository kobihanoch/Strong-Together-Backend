import crypto from 'crypto';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { loginResponseSchema, logoutResponseSchema, refreshTokenResponseSchema } from '@strong-together/shared';
import {
  resetPasswordResponseSchema,
  createUserResponseSchema,
  getAuthenticatedUserByIdResponseSchema,
} from '@strong-together/shared';
import {
  authHeaders,
  createForgotPasswordToken,
  createVerifyToken,
  loginTestUser,
  logoutHeaders,
  refreshHeaders,
} from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { getUserAuthStateByUsername } from '../../common/tests/helpers/db';
import {
  clearEmailQueue,
  getEmailQueueJobCount,
  getLatestEmailJob,
} from '../../common/tests/helpers/infra';

let app: Awaited<ReturnType<typeof createApp>>;

beforeAll(async () => {
  app = await createApp();
});

async function createUnverifiedUser(overrides?: {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Unknown';
}) {
  const suffix = crypto.randomUUID().slice(0, 8);
  const username = overrides?.username ?? `verify_${suffix}`;
  const email = overrides?.email ?? `${username}@example.com`;
  const password = overrides?.password ?? 'Test1234!';
  const fullName = overrides?.fullName ?? 'Verify Flow';
  const gender = overrides?.gender ?? 'Other';

  const createResponse = await request(app.getHttpServer()).post('/api/users/create').set('x-app-version', '4.5.0').send({
    username,
    fullName,
    email,
    password,
    gender,
  });

  expect(createResponse.status).toBe(201);
  expectSchema(createUserResponseSchema, createResponse.body);

  return {
    username,
    email,
    password,
    createResponse,
  };
}

async function createVerifiedUser(overrides?: {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Unknown';
}) {
  const created = await createUnverifiedUser(overrides);
  const user = await getUserAuthStateByUsername(created.username);
  const token = createVerifyToken(user!.id);

  const verifyResponse = await request(app.getHttpServer()).get('/api/auth/verify').query({ token }).set('x-app-version', '4.5.0');

  expect(verifyResponse.status).toBe(200);

  return {
    ...created,
    userId: user!.id,
  };
}

describe('Auth Login', () => {
  // login -> assert tokens and response payload
  it('logs in with valid credentials', async () => {
    const response = await loginTestUser();

    expect(response.status).toBe(201);
    expectSchema(loginResponseSchema, response.body);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toBeTypeOf('string');
    expect(response.body.accessToken).toBeTypeOf('string');
    expect(response.body.refreshToken).toBeTypeOf('string');
  });

  // login -> get authenticated user -> assert protected access works
  it('uses the access token to reach a protected route', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);

    const accessToken = loginResponse.body.accessToken as string;

    const meResponse = await request(app.getHttpServer()).get('/api/users/get').set(authHeaders(accessToken));

    expect(meResponse.status).toBe(200);
    expectSchema(getAuthenticatedUserByIdResponseSchema, meResponse.body);
    expect(meResponse.body.id).toBe(loginResponse.body.user);
    expect(meResponse.body.username).toBe('auth_test_user');
  });

  // login -> refresh tokens -> get authenticated user with new token -> assert session refresh works
  it('refreshes tokens with a valid refresh token and uses the new access token', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);

    const refreshToken = loginResponse.body.refreshToken as string;

    const refreshResponse = await request(app.getHttpServer()).post('/api/auth/refresh').set(refreshHeaders(refreshToken));

    expect(refreshResponse.status).toBe(201);
    expectSchema(refreshTokenResponseSchema, refreshResponse.body);
    expect(refreshResponse.body.message).toBe('Access token refreshed');
    expect(refreshResponse.body.userId).toBe(loginResponse.body.user);
    expect(refreshResponse.body.accessToken).toBeTypeOf('string');
    expect(refreshResponse.body.refreshToken).toBeTypeOf('string');

    const meResponse = await request(app.getHttpServer()).get('/api/users/get').set(authHeaders(refreshResponse.body.accessToken));

    expect(meResponse.status).toBe(200);
    expectSchema(getAuthenticatedUserByIdResponseSchema, meResponse.body);
    expect(meResponse.body.id).toBe(loginResponse.body.user);
    expect(meResponse.body.username).toBe('auth_test_user');
  });

  // login -> logout -> get authenticated user with old token -> assert old session is invalidated
  it('invalidates the old session after logout', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);

    const accessToken = loginResponse.body.accessToken as string;
    const refreshToken = loginResponse.body.refreshToken as string;

    const logoutResponse = await request(app.getHttpServer()).post('/api/auth/logout').set(logoutHeaders(accessToken, refreshToken));

    expect(logoutResponse.status).toBe(201);
    expectSchema(logoutResponseSchema, logoutResponse.body);
    expect(logoutResponse.body.message).toBe('Logged out successfully');

    const meResponse = await request(app.getHttpServer()).get('/api/users/get').set(authHeaders(accessToken));

    expect(meResponse.status).toBe(401);
  });

  // login with wrong password -> assert invalid credentials
  it('rejects login with wrong password', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: 'auth_test_user',
      password: 'WrongPassword123!',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  // get protected route without token -> assert 401
  it('rejects protected route access without token', async () => {
    const app = await createApp();

    const response = await request(app.getHttpServer()).get('/api/users/get').set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // create unverified user -> checkuserverify -> assert verification state is false
  it('reports an unverified user as not verified', async () => {
    const { username } = await createUnverifiedUser();

    const checkResponse = await request(app.getHttpServer())
      .get('/api/auth/checkuserverify')
      .query({ username })
      .set('x-app-version', '4.5.0');

    expect(checkResponse.status).toBe(200);
    expect(checkResponse.body.isVerified).toBe(false);
  });

  // create unverified user -> login fails -> verify with token -> checkuserverify -> login succeeds
  it('verifies a newly created user and allows login afterward', async () => {
    const { username, password } = await createUnverifiedUser({ gender: 'Female' });

    const blockedLoginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: username,
      password,
    });

    expect(blockedLoginResponse.status).toBe(401);
    expect(blockedLoginResponse.body.message).toBe('You need to verify you account');

    const createdUser = await getUserAuthStateByUsername(username);
    const token = createVerifyToken(createdUser!.id);

    const verifyResponse = await request(app.getHttpServer()).get('/api/auth/verify').query({ token }).set('x-app-version', '4.5.0');

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.headers['content-type']).toContain('text/html');
    expect(verifyResponse.text).toContain('You can safely return to the app, and login.');

    const verifiedUser = await getUserAuthStateByUsername(username);
    expect(verifiedUser?.is_verified).toBe(true);

    const checkResponse = await request(app.getHttpServer())
      .get('/api/auth/checkuserverify')
      .query({ username })
      .set('x-app-version', '4.5.0');

    expect(checkResponse.status).toBe(200);
    expect(checkResponse.body.isVerified).toBe(true);

    const loginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: username,
      password,
    });

    expect(loginResponse.status).toBe(201);
    expectSchema(loginResponseSchema, loginResponse.body);
    expect(loginResponse.body.message).toBe('Login successful');
    expect(loginResponse.body.user).toBe(createdUser!.id);
  });

  // verify with invalid token -> assert verification html failure response
  it('rejects account verification with an invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/verify')
      .query({ token: 'not-a-real-token' })
      .set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('Verification Failed');
  });

  // send verification email for existing user -> assert no enumeration-safe 204 response
  it('accepts resend verification email requests for an existing account', async () => {
    const { email } = await createUnverifiedUser();
    await clearEmailQueue();

    const response = await request(app.getHttpServer()).post('/api/auth/sendverificationemail').set('x-app-version', '4.5.0').send({
      email,
    });

    expect(response.status).toBe(201);
    expect(response.text).toBe('');
    expect(await getEmailQueueJobCount()).toBe(1);

    const job = await getLatestEmailJob();
    expect(job?.data).toMatchObject({
      to: email,
      subject: 'Confirm your Strong Together account',
    });
  });

  // send verification email for missing user -> assert same 204 response without leaking account existence
  it('returns the same resend verification response for an unknown email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/sendverificationemail')
      .set('x-app-version', '4.5.0')
      .send({
        email: `missing_${crypto.randomUUID().slice(0, 8)}@example.com`,
      });

    expect(response.status).toBe(201);
    expect(response.text).toBe('');
  });

  // create unverified user -> changeemailverify -> assert email is replaced and login follows the new identifier only
  it('changes the email for an unverified account and keeps verification pending', async () => {
    const { username, email, password } = await createUnverifiedUser();
    const newEmail = `updated_${crypto.randomUUID().slice(0, 8)}@example.com`;

    const response = await request(app.getHttpServer()).put('/api/auth/changeemailverify').set('x-app-version', '4.5.0').send({
      username,
      password,
      newEmail,
    });

    expect(response.status).toBe(200);

    const updatedUser = await getUserAuthStateByUsername(username);
    expect(updatedUser?.email).toBe(newEmail);
    expect(updatedUser?.is_verified).toBe(false);

    const oldEmailLoginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: email,
      password,
    });

    expect(oldEmailLoginResponse.status).toBe(401);
    expect(oldEmailLoginResponse.body.message).toBe('Invalid credentials');

    const newEmailLoginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: newEmail,
      password,
    });

    expect(newEmailLoginResponse.status).toBe(401);
    expect(newEmailLoginResponse.body.message).toBe('You need to verify you account');
  });

  // changeemailverify for verified user -> assert flow is rejected because account is already verified
  it('rejects changing email through verification flow for an already verified account', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/auth/changeemailverify')
      .set('x-app-version', '4.5.0')
      .send({
        username: 'auth_test_user',
        password: 'Test1234!',
        newEmail: `verified_${crypto.randomUUID().slice(0, 8)}@example.com`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Account already verified');
  });

  // create unverified user -> changeemailverify with taken email -> assert conflict and keep original email
  it('rejects changing email when the requested email is already in use', async () => {
    const { username, password, email } = await createUnverifiedUser();

    const response = await request(app.getHttpServer()).put('/api/auth/changeemailverify').set('x-app-version', '4.5.0').send({
      username,
      password,
      newEmail: 'conflict_user@example.com',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');

    const unchangedUser = await getUserAuthStateByUsername(username);
    expect(unchangedUser?.email).toBe(email);
  });

  // forgotpassemail with existing app user -> assert enumeration-safe 204 response
  it('accepts forgot password requests for an existing app user', async () => {
    const { username } = await createVerifiedUser();
    const user = await getUserAuthStateByUsername(username);
    await clearEmailQueue();

    const response = await request(app.getHttpServer()).post('/api/auth/forgotpassemail').set('x-app-version', '4.5.0').send({
      identifier: username,
    });

    expect(response.status).toBe(201);
    expect(response.text).toBe('');
    expect(await getEmailQueueJobCount()).toBe(1);

    const job = await getLatestEmailJob();
    expect(job?.data).toMatchObject({
      to: user?.email,
      subject: expect.stringContaining('Reset'),
    });
  });

  // forgotpassemail with unknown identifier -> assert same 204 response without leaking existence
  it('returns the same forgot password response for an unknown identifier', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/forgotpassemail')
      .set('x-app-version', '4.5.0')
      .send({
        identifier: `missing_${crypto.randomUUID().slice(0, 8)}`,
      });

    expect(response.status).toBe(201);
    expect(response.text).toBe('');
  });

  // forgotpassemail for oauth-only user -> assert app-password reset is intentionally ignored
  it('ignores forgot password requests for oauth-only accounts', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/forgotpassemail').set('x-app-version', '4.5.0').send({
      identifier: 'oauth_complete_user',
    });

    expect(response.status).toBe(201);
    expect(response.text).toBe('');
  });

  // create verified user -> resetpassword -> old password fails -> new password succeeds
  it('resets the password and allows login only with the new password afterward', async () => {
    const { username, password, userId } = await createVerifiedUser();
    const newPassword = 'Reset1234!';
    const beforeResetUser = await getUserAuthStateByUsername(username);
    const token = createForgotPasswordToken(userId);

    const response = await request(app.getHttpServer())
      .put('/api/auth/resetpassword')
      .query({ token })
      .set('x-app-version', '4.5.0')
      .send({
        newPassword,
      });

    expect(response.status).toBe(200);
    expectSchema(resetPasswordResponseSchema, response.body);
    expect(response.body.ok).toBe(true);

    const afterResetUser = await getUserAuthStateByUsername(username);
    expect(afterResetUser?.password).toBeTypeOf('string');
    expect(afterResetUser?.password).not.toBe(beforeResetUser?.password);

    const oldPasswordLoginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: username,
      password,
    });

    expect(oldPasswordLoginResponse.status).toBe(401);
    expect(oldPasswordLoginResponse.body.message).toBe('Invalid credentials');

    const newPasswordLoginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: username,
      password: newPassword,
    });

    expect(newPasswordLoginResponse.status).toBe(201);
    expectSchema(loginResponseSchema, newPasswordLoginResponse.body);
    expect(newPasswordLoginResponse.body.message).toBe('Login successful');
    expect(newPasswordLoginResponse.body.user).toBe(userId);
  });

  // resetpassword with invalid token -> assert reset is rejected before touching the password
  it('rejects password reset with an invalid token', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/auth/resetpassword')
      .query({ token: 'not-a-real-token' })
      .set('x-app-version', '4.5.0')
      .send({
        newPassword: 'Reset1234!',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Verfication token is not valid');
  });

  // resetpassword without token -> assert validation fails with missing token
  it('rejects password reset without a token', async () => {
    const response = await request(app.getHttpServer()).put('/api/auth/resetpassword').set('x-app-version', '4.5.0').send({
      newPassword: 'Reset1234!',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing token');
  });
});
