import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { loginResponseSchema, logoutResponseSchema, refreshTokenResponseSchema } from '@strong-together/shared';
import { createApp } from '../../../app';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import {
  createVerifiedTestUser,
  deleteUserByUsername,
  getUserLastLoginByUsername,
  getUserSessionStateByUsername,
  setUserPushTokenByUsername,
} from '../../../common/tests/helpers/db';
import { authHeaders, logoutHeaders, refreshHeaders } from '../../../common/tests/helpers/auth';

let app: Awaited<ReturnType<typeof createApp>>;
const createdUsernames = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all([...createdUsernames].map((username) => deleteUserByUsername(username)));
  createdUsernames.clear();
});

async function createSessionUser(overrides: { isFirstLogin?: boolean } = {}) {
  const username = `session_${crypto.randomUUID().slice(0, 8)}`;
  createdUsernames.add(username);
  const userId = await createVerifiedTestUser({
    username,
    email: `${username}@example.com`,
    fullName: 'Session Controller',
    ...(overrides.isFirstLogin === undefined ? {} : { isFirstLogin: overrides.isFirstLogin }),
  });

  return {
    userId,
    username,
    email: `${username}@example.com`,
    password: 'Test1234!',
  };
}

function tokenVersion(token: string) {
  const decoded = jwt.decode(token);
  expect(decoded).toMatchObject({ tokenVer: expect.anything() });
  return Number((decoded as { tokenVer: number | string }).tokenVer);
}

describe('SessionController', () => {
  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials and updates DB session state', async () => {
      const user = await createSessionUser();
      const beforeLogin = await getUserSessionStateByUsername(user.username);

      const response = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
        identifier: user.email,
        password: user.password,
      });

      expect(response.status).toBe(201);
      expectSchema(loginResponseSchema, response.body);
      expect(response.body).toMatchObject({
        message: 'Login successful',
        user: user.userId,
      });

      const afterLogin = await getUserSessionStateByUsername(user.username);
      expect(afterLogin?.tokenVersion).toBe((beforeLogin?.tokenVersion ?? 0) + 1);
      expect(afterLogin?.lastLogin).toBeInstanceOf(Date);
      expect(tokenVersion(response.body.accessToken)).toBe(afterLogin?.tokenVersion);
      expect(tokenVersion(response.body.refreshToken)).toBe(afterLogin?.tokenVersion);

      const { lastLogin, databaseNow } = await getUserLastLoginByUsername(user.username);
      expect(lastLogin!.getTime()).toBeLessThanOrEqual(databaseNow!.getTime());
    });

    it('rejects invalid request bodies with 400', async () => {
      const response = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
        identifier: 'missing-password@example.com',
      });

      expect(response.status).toBe(400);
    });

    it('rejects wrong credentials and unknown users with 401', async () => {
      const user = await createSessionUser();

      const wrongPassword = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
        identifier: user.email,
        password: 'WrongPassword123!',
      });

      expect(wrongPassword.status).toBe(401);
      expect(wrongPassword.body.message).toBe('Invalid credentials');

      const missingUser = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
        identifier: `missing_${crypto.randomUUID().slice(0, 8)}@example.com`,
        password: user.password,
      });

      expect(missingUser.status).toBe(401);
      expect(missingUser.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('rotates tokens and invalidates the previous refresh token', async () => {
      const user = await createSessionUser();
      const loginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
        identifier: user.username,
        password: user.password,
      });
      expectSchema(loginResponseSchema, loginResponse.body);

      const beforeRefresh = await getUserSessionStateByUsername(user.username);
      const refreshResponse = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set(refreshHeaders(loginResponse.body.refreshToken));

      expect(refreshResponse.status).toBe(201);
      expectSchema(refreshTokenResponseSchema, refreshResponse.body);
      expect(refreshResponse.body).toMatchObject({
        message: 'Access token refreshed',
        userId: user.userId,
      });

      const afterRefresh = await getUserSessionStateByUsername(user.username);
      expect(afterRefresh?.tokenVersion).toBe((beforeRefresh?.tokenVersion ?? 0) + 1);
      expect(tokenVersion(refreshResponse.body.accessToken)).toBe(afterRefresh?.tokenVersion);
      expect(tokenVersion(refreshResponse.body.refreshToken)).toBe(afterRefresh?.tokenVersion);

      const staleRefreshResponse = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set(refreshHeaders(loginResponse.body.refreshToken));
      expect(staleRefreshResponse.status).toBe(401);
      expect(staleRefreshResponse.body.message).toBe('New login required');
    });

    it('rejects missing or invalid refresh tokens with 401', async () => {
      const missing = await request(app.getHttpServer()).post('/api/auth/refresh').set('x-app-version', '4.5.0');
      expect(missing.status).toBe(401);
      expect(missing.body.message).toBe('No refresh token provided');

      const invalid = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set(refreshHeaders('not-a-real-token'));
      expect(invalid.status).toBe(401);
      expect(invalid.body.message).toBe('Invalid or expired refresh token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('logs out, clears push token, and invalidates the old access token', async () => {
      const user = await createSessionUser();
      await setUserPushTokenByUsername(user.username, 'ExponentPushToken[session-test]');

      const loginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
        identifier: user.username,
        password: user.password,
      });
      expectSchema(loginResponseSchema, loginResponse.body);

      const beforeLogout = await getUserSessionStateByUsername(user.username);
      const logoutResponse = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set(logoutHeaders(loginResponse.body.accessToken, loginResponse.body.refreshToken));

      expect(logoutResponse.status).toBe(201);
      expectSchema(logoutResponseSchema, logoutResponse.body);
      expect(logoutResponse.body.message).toBe('Logged out successfully');

      const afterLogout = await getUserSessionStateByUsername(user.username);
      expect(afterLogout?.pushToken).toBeNull();
      expect(afterLogout?.tokenVersion).toBe((beforeLogout?.tokenVersion ?? 0) + 1);

      const protectedResponse = await request(app.getHttpServer())
        .get('/api/users/get')
        .set(authHeaders(loginResponse.body.accessToken));
      expect(protectedResponse.status).toBe(401);
      expect(protectedResponse.body.message).toBe('New login required');
    });

    it('rejects logout without an access token with 401', async () => {
      const response = await request(app.getHttpServer()).post('/api/auth/logout').set('x-app-version', '4.5.0');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No access token provided');
    });
  });
});
