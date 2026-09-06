import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { clearPushQueue, getLatestPushJob, getPushQueueJobCount } from '../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

beforeEach(async () => {
  await clearPushQueue();
});

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

describe('PushController', () => {
  it('POST /api/push-jobs/daily enqueues Redis-backed push notification jobs', async () => {
    const user = await createAndLoginTestUser(app, 'push_daily');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);
    const pushToken = 'ExponentPushToken[daily-controller-token]';
    await request(app.getHttpServer()).put('/api/users/me/push-token').set(authHeaders(user.accessToken)).send({ token: pushToken });

    const response = await request(app.getHttpServer()).post('/api/push-jobs/daily').set('x-app-version', '4.5.0');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, message: 'Daily notifications enqueued' });
    expect(await getPushQueueJobCount()).toBeGreaterThan(0);
    expect((await getLatestPushJob())?.data).toMatchObject({ token: pushToken, body: 'Ready to go workout?' });
  });
});
