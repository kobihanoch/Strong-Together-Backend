import crypto from 'crypto';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { loginResponseSchema, resetPasswordResponseSchema } from '@strong-together/shared';
import { createApp } from '../../../app';
import { createForgotPasswordToken } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import { getUserAuthStateByUsername } from '../../../common/tests/helpers/db';
import { appConfig } from '../../../config/app.config';
import {
  clearEmailQueue,
  clearMaildevMessages,
  deleteRedisKeysByPattern,
  deliverLatestEmailJobToMaildev,
  getEmailQueueJobCount,
  getLatestEmailJob,
  waitForMaildevMessage,
} from '../../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser, loginWithCredentials } from '../../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

beforeEach(async () => {
  await clearEmailQueue();
  await clearMaildevMessages();
});

afterEach(async () => {
  await deleteRedisKeysByPattern('forgotpassword:jti:*');
  await cleanupTestUsers(users);
  users.clear();
});

describe('PasswordController', () => {
  it('POST /api/auth/forgotpassemail enqueues a Redis-backed email job for an existing user', async () => {
    const user = await createAndLoginTestUser(app, 'password_email');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);

    const response = await request(app.getHttpServer()).post('/api/auth/forgotpassemail').set('x-app-version', '4.5.0').send({
      identifier: user.email,
    });

    expect(response.status).toBe(201);
    expect(response.text).toBe('');
    expect(await getEmailQueueJobCount()).toBe(1);
    const latestJob = await getLatestEmailJob();
    expect(latestJob?.data).toMatchObject({
      to: user.email,
      subject: expect.stringContaining('Reset'),
    });
    expect(latestJob?.data.html).toContain(`${appConfig.emailWebBaseUrl}/reset-password`);
    expect(latestJob?.data.html).toContain(`${appConfig.emailWebBaseUrl}/appicon.png`);

    const job = await deliverLatestEmailJobToMaildev();
    expect(job).not.toBeNull();
    const message = await waitForMaildevMessage('Reset');
    expect(message?.subject).toContain('Reset');
    expect(JSON.stringify(message?.to)).toContain(user.email);
  });

  it('PUT /api/auth/resetpassword updates DB password, stores Redis JTI, and allows only the new login', async () => {
    const user = await createAndLoginTestUser(app, 'password_reset');
    users.add(user.username);
    const before = await getUserAuthStateByUsername(user.username);
    const token = createForgotPasswordToken(user.userId);

    const response = await request(app.getHttpServer())
      .put('/api/auth/resetpassword')
      .query({ token })
      .set('x-app-version', '4.5.0')
      .send({ newPassword: 'Reset1234!' });

    expect(response.status).toBe(200);
    expectSchema(resetPasswordResponseSchema, response.body);
    expect(response.body.ok).toBe(true);

    const after = await getUserAuthStateByUsername(user.username);
    expect(after?.password).toBeTypeOf('string');
    expect(after?.password).not.toBe(before?.password);

    const oldLogin = await loginWithCredentials(app, user.email, user.password);
    const newLogin = await loginWithCredentials(app, user.email, 'Reset1234!');
    expect(oldLogin.status).toBe(401);
    expect(newLogin.status).toBe(201);
    expectSchema(loginResponseSchema, newLogin.body);

    const reused = await request(app.getHttpServer())
      .put('/api/auth/resetpassword')
      .query({ token })
      .set('x-app-version', '4.5.0')
      .send({ newPassword: 'Reset5678!' });
    expect(reused.status).toBe(400);
    expect(reused.body.message).toBe('URL already used or expired');
  });

  it('password endpoints return 400 for invalid payloads and enumeration-safe forgot response for missing users', async () => {
    const forgotMissing = await request(app.getHttpServer())
      .post('/api/auth/forgotpassemail')
      .set('x-app-version', '4.5.0')
      .send({ identifier: `missing_${crypto.randomUUID().slice(0, 8)}` });
    const resetMissingToken = await request(app.getHttpServer())
      .put('/api/auth/resetpassword')
      .set('x-app-version', '4.5.0')
      .send({ newPassword: 'Reset1234!' });

    expect(forgotMissing.status).toBe(201);
    expect(forgotMissing.text).toBe('');
    expect(resetMissingToken.status).toBe(400);
    expect(resetMissingToken.body.message).toBe('Missing token');
  });
});
