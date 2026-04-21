import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { configureHourlyReminderForUser, getWorkoutSplitId } from '../../common/tests/helpers/db';
import { clearPushQueue, getLatestPushJob, getPushQueueJobCount } from '../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';
import { addWorkoutPlan } from '../../common/tests/helpers/workouts';

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
  it('GET /api/push/daily enqueues Redis-backed push notification jobs', async () => {
    const user = await createAndLoginTestUser(app, 'push_daily');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);
    const pushToken = 'ExponentPushToken[daily-controller-token]';
    await request(app.getHttpServer()).put('/api/users/pushtoken').set(authHeaders(user.accessToken)).send({ token: pushToken });

    const response = await request(app.getHttpServer()).get('/api/push/daily').set('x-app-version', '4.5.0');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, message: 'Daily notifications enqueued' });
    expect(await getPushQueueJobCount()).toBeGreaterThan(0);
    expect((await getLatestPushJob())?.data).toMatchObject({ token: pushToken, body: 'Ready to go workout?' });
  });

  it('GET /api/push/hourlyreminder enqueues delayed reminder jobs from DB reminder state', async () => {
    const user = await createAndLoginTestUser(app, 'push_hourly');
    users.add(user.username);
    const pushToken = 'ExponentPushToken[hourly-controller-token]';
    await request(app.getHttpServer()).put('/api/users/pushtoken').set(authHeaders(user.accessToken)).send({ token: pushToken });
    await addWorkoutPlan(app, user.accessToken, { A: [{ id: 20, sets: [8], order_index: 0 }] });
    const splitId = await getWorkoutSplitId(user.userId, 'A');
    expect(splitId).not.toBeNull();
    await configureHourlyReminderForUser(user.userId, splitId!, new Date(Date.now() + 5 * 60 * 1000).toISOString());

    const response = await request(app.getHttpServer()).get('/api/push/hourlyreminder').set('x-app-version', '4.5.0');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Enqueued 1 workout reminders');
    expect(await getPushQueueJobCount()).toBeGreaterThan(0);
    const job = await getLatestPushJob();
    expect(job?.data).toMatchObject({ token: pushToken, title: 'Workout Reminder' });
    expect(job?.opts.delay).toBeGreaterThan(0);
  });
});
