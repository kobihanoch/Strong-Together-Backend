import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getAnalyticsResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { getExerciseToWorkoutSplitId, getWorkoutSummaryCount } from '../../common/tests/helpers/db';
import { deleteRedisKeysByPattern, getRedisKey } from '../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';
import { replaceWorkoutPlan, finishWorkout } from '../../common/tests/helpers/workouts';
import { buildAnalyticsKeyStable } from './analytics.cache';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const userIds = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all([...userIds].map((userId) => deleteRedisKeysByPattern(`xt:analytics:v1:${userId}`)));
  await cleanupTestUsers(users);
  users.clear();
  userIds.clear();
});

async function analyticsUser(prefix = 'analytics') {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  userIds.add(user.userId);
  expectSchema(loginResponseSchema, user.loginResponse.body);
  return user;
}

describe('AnalyticsController', () => {
  it('GET /api/analytics returns empty User A analytics and warms Redis', async () => {
    const user = await analyticsUser('analytics_empty');
    const response = await request(app.getHttpServer()).get('/api/analytics').set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.headers['x-cache']).toBe('MISS');
    expectSchema(getAnalyticsResponseSchema, response.body);
    expect(response.body).toEqual({ oneRepMaxes: {}, goals: {} });
    expect(await getRedisKey(buildAnalyticsKeyStable(user.userId))).toBeTypeOf('string');
  });

  it('GET /api/analytics returns User C aggregates from DB-backed workout flow and Redis HIT', async () => {
    const user = await analyticsUser('analytics_full');
    await replaceWorkoutPlan(app, user.accessToken, { A: [{ id: 20, sets: [8, 8, 10], orderIndex: 0 }] });
    const etsId = await getExerciseToWorkoutSplitId(user.userId, 'A', 20);
    expect(etsId).not.toBeNull();
    await finishWorkout(app, user.accessToken, [
      {
        isExerciseAssignedToSplit: true,
        exerciseToSplitId: etsId!,
        trackedSets: [
          { weight: 80, reps: 8, setIndex: 0 },
          { weight: 80, reps: 8, setIndex: 1 },
          { weight: 75, reps: 10, setIndex: 2 },
        ],
      },
    ]);

    const first = await request(app.getHttpServer()).get('/api/analytics').set(authHeaders(user.accessToken));
    const second = await request(app.getHttpServer()).get('/api/analytics').set(authHeaders(user.accessToken));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.headers['x-cache']).toBe('MISS');
    expect(second.headers['x-cache']).toBe('HIT');
    expectSchema(getAnalyticsResponseSchema, second.body);
    expect(await getWorkoutSummaryCount(user.userId)).toBe(1);
    expect(second.body.oneRepMaxes).toHaveProperty('20');
    expect(second.body.goals).toHaveProperty('A');
  });

  it('GET /api/analytics rejects unauthenticated requests with 401', async () => {
    const response = await request(app.getHttpServer()).get('/api/analytics').set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});
