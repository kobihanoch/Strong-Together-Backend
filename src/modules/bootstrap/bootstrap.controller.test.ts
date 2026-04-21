import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapResponseSchema, loginResponseSchema, userAerobicsResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { getExerciseToWorkoutSplitId, getUserReminderTimezone } from '../../common/tests/helpers/db';
import { deleteRedisKeysByPattern, getRedisKey } from '../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';
import { addAerobicsRecord } from '../../common/tests/helpers/aerobics';
import { addWorkoutPlan, finishWorkout } from '../../common/tests/helpers/workouts';
import { buildUserTimezoneKeyStable } from './bootstrap.cache';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const userIds = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all([...userIds].map((userId) => deleteRedisKeysByPattern(`xt:*:${userId}*`)));
  await cleanupTestUsers(users);
  users.clear();
  userIds.clear();
});

async function bootstrapUser(prefix = 'bootstrap') {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  userIds.add(user.userId);
  expectSchema(loginResponseSchema, user.loginResponse.body);
  return user;
}

describe('BootstrapController', () => {
  it('GET /api/bootstrap/get returns User A base payload, updates DB timezone, and caches timezone in Redis', async () => {
    const user = await bootstrapUser('bootstrap_empty');
    const response = await request(app.getHttpServer())
      .get('/api/bootstrap/get')
      .query({ tz: 'Europe/London' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(bootstrapResponseSchema, response.body);
    expect(response.body.user.id).toBe(user.userId);
    expect(response.body.workout).toEqual({ workoutPlan: null, workoutPlanForEditWorkout: null });
    expect(response.body.tracking.exerciseTrackingAnalysis.unique_days).toBe(0);
    expect(response.body.messages).toEqual({ messages: [] });
    expect(response.body.aerobics).toEqual({ daily: {}, weekly: {} });
    expect(await getUserReminderTimezone(user.userId)).toBe('Europe/London');
    expect(await getRedisKey(buildUserTimezoneKeyStable(user.userId))).toBeTypeOf('string');
  });

  it('GET /api/bootstrap/get returns User C workout/tracking/message/aerobics data with shared schema', async () => {
    const user = await bootstrapUser('bootstrap_full');
    await addWorkoutPlan(app, user.accessToken, { A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }] });
    const etsId = await getExerciseToWorkoutSplitId(user.userId, 'A', 20);
    expect(etsId).not.toBeNull();
    await finishWorkout(app, user.accessToken, [{ exercisetosplit_id: etsId!, weight: [80], reps: [8] }]);

    const aerobics = await addAerobicsRecord(app, user.accessToken, {
      type: 'Walk',
      durationMins: 20,
      durationSec: 0,
    });
    expectSchema(userAerobicsResponseSchema, aerobics.body);

    const response = await request(app.getHttpServer())
      .get('/api/bootstrap/get')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(bootstrapResponseSchema, response.body);
    expect(response.body.workout.workoutPlan.numberofsplits).toBe(1);
    expect(response.body.tracking.exerciseTrackingAnalysis.unique_days).toBe(1);
    expect(response.body.messages.messages).toHaveLength(1);
    expect(Object.keys(response.body.aerobics.daily)).toHaveLength(1);
  });

  it('GET /api/bootstrap/get rejects unauthenticated requests with 401', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/bootstrap/get')
      .query({ tz: 'Asia/Jerusalem' })
      .set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});
