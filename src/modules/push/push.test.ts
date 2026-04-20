import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { createUserResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { clearPushQueue, getLatestPushJob, getPushQueueJobCount } from '../../common/tests/helpers/infra';
import { addWorkoutPlan } from '../../common/tests/helpers/workouts';
import { configureHourlyReminderForUser, getWorkoutSplitId } from '../../common/tests/helpers/db';
import { createAppUser, loginWithCredentials, verifyAppUser } from '../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;

beforeAll(async () => {
  app = await createApp();
});

beforeEach(async () => {
  await clearPushQueue();
});

describe('Push', () => {
  // login -> save push token -> trigger daily endpoint -> assert Redis queue job was enqueued
  it('enqueues daily push notifications into the Redis-backed queue', async () => {
    const createResult = await createAppUser(app, {
      fullName: 'Push Daily User',
    });
    expect(createResult.response.status).toBe(201);
    expectSchema(createUserResponseSchema, createResult.response.body);

    const verifyResponse = await verifyAppUser(app, createResult.response.body.user.id);
    expect(verifyResponse.status).toBe(200);

    const loginResponse = await loginWithCredentials(app, createResult.email, createResult.password);
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const pushToken = 'ExponentPushToken[daily-test-token]';

    const saveResponse = await request(app.getHttpServer()).put('/api/users/pushtoken').set(authHeaders(accessToken)).send({
      token: pushToken,
    });

    expect(saveResponse.status).toBe(200);

    const response = await request(app.getHttpServer()).get('/api/push/daily').set('x-app-version', '4.5.0');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Daily notifications enqueued',
    });
    expect(await getPushQueueJobCount()).toBeGreaterThan(0);

    const job = await getLatestPushJob();
    expect(job?.data).toMatchObject({
      token: pushToken,
      title: expect.stringContaining('Hello'),
      body: 'Ready to go workout?',
    });
  });

  // login -> save push token -> create split timing -> trigger hourly endpoint -> assert delayed push job was enqueued
  it('enqueues hourly reminder notifications into the Redis-backed queue', async () => {
    const createResult = await createAppUser(app, {
      fullName: 'Push Hourly User',
    });
    expect(createResult.response.status).toBe(201);
    expectSchema(createUserResponseSchema, createResult.response.body);

    const verifyResponse = await verifyAppUser(app, createResult.response.body.user.id);
    expect(verifyResponse.status).toBe(200);

    const loginResponse = await loginWithCredentials(app, createResult.email, createResult.password);
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;
    const pushToken = 'ExponentPushToken[hourly-test-token]';

    await request(app.getHttpServer()).put('/api/users/pushtoken').set(authHeaders(accessToken)).send({
      token: pushToken,
    });

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 8], order_index: 0 }],
    });

    const splitId = await getWorkoutSplitId(userId, 'A');
    expect(splitId).not.toBeNull();

    const estimatedTimeUtc = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await configureHourlyReminderForUser(userId, splitId!, estimatedTimeUtc);

    const response = await request(app.getHttpServer()).get('/api/push/hourlyreminder').set('x-app-version', '4.5.0');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Enqueued 1 workout reminders');
    expect(await getPushQueueJobCount()).toBeGreaterThan(0);

    const job = await getLatestPushJob();
    expect(job?.data).toMatchObject({
      token: pushToken,
      title: 'Workout Reminder',
    });
    expect(job?.opts.delay).toBeGreaterThan(0);
  });
});
