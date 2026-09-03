import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getWorkoutPlanResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import { getActiveWorkoutSplitNames } from '../../../common/tests/helpers/db';
import { deleteRedisKeysByPattern, getRedisKey } from '../../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../../common/tests/helpers/users';
import { buildPlanKeyStable } from './plan.cache';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const userIds = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all([...userIds].map((userId) => deleteRedisKeysByPattern(`xt:workoutplan:v1:${userId}:*`)));
  await cleanupTestUsers(users);
  users.clear();
  userIds.clear();
});

async function workoutUser(prefix = 'plan') {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  userIds.add(user.userId);
  expectSchema(loginResponseSchema, user.loginResponse.body);
  return user;
}

describe('WorkoutPlanController', () => {
  it('GET /api/workout-plan returns User A empty plan and warms Redis', async () => {
    const user = await workoutUser('plan_empty');
    const response = await request(app.getHttpServer()).get('/api/workout-plan').query({ tz: 'Asia/Jerusalem' }).set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.headers['x-cache']).toBe('MISS');
    expectSchema(getWorkoutPlanResponseSchema, response.body);
    expect(response.body).toEqual({ workoutPlan: null });
    expect(await getRedisKey(buildPlanKeyStable(user.userId, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('PUT /api/workout-plan creates User B plan, deletes its cache key, and returns 204', async () => {
    const user = await workoutUser('plan_add');
    const response = await request(app.getHttpServer())
      .put('/api/workout-plan')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutName: 'Controller Plan',
        workoutData: [
          { name: 'A', orderIndex: 0, exercises: [{ exerciseId: 20, sets: [8, 8, 10], orderIndex: 0 }] },
          { name: 'B', orderIndex: 1, exercises: [{ exerciseId: 12, sets: [10, 10], orderIndex: 0 }] },
        ],
      });

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(await getActiveWorkoutSplitNames(user.userId)).toEqual(['A', 'B']);
    expect(await getRedisKey(buildPlanKeyStable(user.userId, 'Asia/Jerusalem'))).toBeNull();
  });

  it('GET /api/workout-plan returns User B plan from Redis on repeated reads', async () => {
    const user = await workoutUser('plan_cache');
    await request(app.getHttpServer())
      .put('/api/workout-plan')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutName: 'Cache Plan',
        workoutData: [{ name: 'A', orderIndex: 0, exercises: [{ exerciseId: 20, sets: [5, 5], orderIndex: 0 }] }],
      });

    const first = await request(app.getHttpServer()).get('/api/workout-plan').query({ tz: 'Asia/Jerusalem' }).set(authHeaders(user.accessToken));
    const second = await request(app.getHttpServer()).get('/api/workout-plan').query({ tz: 'Asia/Jerusalem' }).set(authHeaders(user.accessToken));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.headers['x-cache']).toBe('MISS');
    expect(second.headers['x-cache']).toBe('HIT');
    expectSchema(getWorkoutPlanResponseSchema, second.body);
  });

  it('PUT /api/workout-plan renames and reorders splits with IDs and creates splits without IDs', async () => {
    const user = await workoutUser('plan_update');
    const created = await request(app.getHttpServer())
      .put('/api/workout-plan')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutData: [
          { name: 'A', orderIndex: 0, exercises: [{ exerciseId: 20, sets: [8], orderIndex: 0 }] },
          { name: 'B', orderIndex: 1, exercises: [{ exerciseId: 12, sets: [10], orderIndex: 0 }] },
        ],
      });

    expect(created.status).toBe(204);
    const createdPlan = await request(app.getHttpServer())
      .get('/api/workout-plan')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    const [splitA, splitB] = createdPlan.body.workoutPlan.workoutSplits;
    const updated = await request(app.getHttpServer())
      .put('/api/workout-plan')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutData: [
          { id: splitB.id, name: 'Pull', orderIndex: 0, exercises: [{ exerciseId: 12, sets: [10], orderIndex: 0 }] },
          { id: splitA.id, name: 'Push', orderIndex: 1, exercises: [{ exerciseId: 20, sets: [8], orderIndex: 0 }] },
          { name: 'Legs', orderIndex: 2, exercises: [{ exerciseId: 12, sets: [12], orderIndex: 0 }] },
        ],
      });

    expect(updated.status).toBe(204);
    const updatedPlan = await request(app.getHttpServer())
      .get('/api/workout-plan')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    expect(updatedPlan.body.workoutPlan.workoutSplits).toMatchObject([
      { id: splitB.id, name: 'Pull', orderIndex: 0 },
      { id: splitA.id, name: 'Push', orderIndex: 1 },
      { name: 'Legs', orderIndex: 2 },
    ]);
  });

  it('PUT /api/workout-plan rejects invalid empty splits with 400', async () => {
    const user = await workoutUser('plan_bad');
    const response = await request(app.getHttpServer())
      .put('/api/workout-plan')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutName: 'Bad Plan',
        workoutData: [{ name: 'A', orderIndex: 0, exercises: [] }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Each split must include at least one exercise');
  });

  it('GET and POST /api/workouts plan endpoints reject unauthenticated requests with 401', async () => {
    const getResponse = await request(app.getHttpServer()).get('/api/workout-plan').query({ tz: 'Asia/Jerusalem' }).set('x-app-version', '4.5.0');
    const postResponse = await request(app.getHttpServer())
      .put('/api/workout-plan')
      .set('x-app-version', '4.5.0')
      .send({
        tz: 'Asia/Jerusalem',
        workoutName: 'No Auth',
        workoutData: [{ name: 'A', orderIndex: 0, exercises: [{ exerciseId: 20, sets: [1], orderIndex: 0 }] }],
      });

    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
  });
});
