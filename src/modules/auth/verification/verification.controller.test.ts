import crypto from 'crypto';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../../app';
import { createVerifyToken } from '../../../common/tests/helpers/auth';
import { createVerifiedTestUser, getUserAuthStateByUsername } from '../../../common/tests/helpers/db';
import {
  clearEmailQueue,
  clearMaildevMessages,
  deleteRedisKeysByPattern,
  deliverLatestEmailJobToMaildev,
  getEmailQueueJobCount,
  getLatestEmailJob,
  waitForMaildevMessage,
} from '../../../common/tests/helpers/infra';
import { cleanupTestUsers } from '../../../common/tests/helpers/users';

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
  await deleteRedisKeysByPattern('accountverify:jti:*');
  await cleanupTestUsers(users);
  users.clear();
});

async function createUnverified(prefix = 'verify') {
  const suffix = crypto.randomUUID().slice(0, 8);
  const username = `${prefix}${suffix}`;
  users.add(username);
  const email = `${username}@example.com`;
  const userId = await createVerifiedTestUser({
    username,
    email,
    fullName: 'Verify Test',
    isVerified: false,
  });
  const dbUser = await getUserAuthStateByUsername(username);
  expect(dbUser).not.toBeNull();
  expect(userId).toBe(dbUser!.id);
  return { username, email, password: 'Test1234!', userId };
}

describe('VerificationController', () => {
  it('GET /api/auth/verify verifies DB state and rejects token reuse through Redis JTI', async () => {
    const user = await createUnverified();
    const token = createVerifyToken(user.userId);

    const response = await request(app.getHttpServer()).get('/api/auth/verify').query({ token }).set('x-app-version', '4.5.0');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect((await getUserAuthStateByUsername(user.username))?.is_verified).toBe(true);

    const reused = await request(app.getHttpServer()).get('/api/auth/verify').query({ token }).set('x-app-version', '4.5.0');
    expect(reused.status).toBe(401);
    expect(reused.text).toContain('Verification Failed');
  });

  it('POST /api/auth/sendverificationemail enqueues Redis-backed verification email without leaking missing users', async () => {
    const user = await createUnverified('verify_mail');
    const response = await request(app.getHttpServer()).post('/api/auth/sendverificationemail').set('x-app-version', '4.5.0').send({
      email: user.email,
    });

    expect(response.status).toBe(201);
    expect(response.text).toBe('');
    expect(await getEmailQueueJobCount()).toBe(1);
    expect((await getLatestEmailJob())?.data).toMatchObject({
      to: user.email,
      subject: 'Confirm your Strong Together account',
    });
    await deliverLatestEmailJobToMaildev();
    const message = await waitForMaildevMessage('Confirm your Strong Together account');
    expect(message?.subject).toBe('Confirm your Strong Together account');
    expect(JSON.stringify(message?.to)).toContain(user.email);

    await clearEmailQueue();
    const missing = await request(app.getHttpServer())
      .post('/api/auth/sendverificationemail')
      .set('x-app-version', '4.5.0')
      .send({ email: `missing_${crypto.randomUUID().slice(0, 8)}@example.com` });
    expect(missing.status).toBe(201);
    expect(await getEmailQueueJobCount()).toBe(0);
  });

  it('PUT /api/auth/changeemailverify updates pending email in DB and sends verification email', async () => {
    const user = await createUnverified('verify_change');
    const newEmail = `updated_${crypto.randomUUID().slice(0, 8)}@example.com`;

    const response = await request(app.getHttpServer()).put('/api/auth/changeemailverify').set('x-app-version', '4.5.0').send({
      username: user.username,
      password: 'Test1234!',
      newEmail,
    });

    expect(response.status).toBe(200);
    expect((await getUserAuthStateByUsername(user.username))?.email).toBe(newEmail);
    expect((await getUserAuthStateByUsername(user.username))?.is_verified).toBe(false);
    expect(await getEmailQueueJobCount()).toBe(1);
    expect((await getLatestEmailJob())?.data.to).toBe(newEmail);
    await deliverLatestEmailJobToMaildev();
    expect(JSON.stringify(await waitForMaildevMessage('Confirm your Strong Together account'))).toContain(newEmail);
  });

  it('GET /api/auth/checkuserverify returns verification state and bad paths return 400/401', async () => {
    const user = await createUnverified('verify_check');
    const check = await request(app.getHttpServer())
      .get('/api/auth/checkuserverify')
      .query({ username: user.username })
      .set('x-app-version', '4.5.0');
    const invalidVerify = await request(app.getHttpServer())
      .get('/api/auth/verify')
      .query({ token: 'not-a-token' })
      .set('x-app-version', '4.5.0');
    const badEmail = await request(app.getHttpServer())
      .post('/api/auth/sendverificationemail')
      .set('x-app-version', '4.5.0')
      .send({ email: 'not-an-email' });

    expect(check.status).toBe(200);
    expect(check.body).toEqual({ isVerified: false });
    expect(invalidVerify.status).toBe(401);
    expect(badEmail.status).toBe(400);
  });
});
