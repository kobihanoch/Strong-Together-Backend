import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { addWorkoutResponseSchema, getWholeUserWorkoutPlanResponseSchema, loginResponseSchema } from '@strong-together/shared';
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
  it('GET /api/workouts/getworkout returns User A empty plan and warms Redis', async () => {
    const user = await workoutUser('plan_empty');
    const response = await request(app.getHttpServer())
      .get('/api/workouts/getworkout')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.headers['x-cache']).toBe('MISS');
    expectSchema(getWholeUserWorkoutPlanResponseSchema, response.body);
    expect(response.body).toEqual({ workoutPlan: null, workoutPlanForEditWorkout: null });
    expect(await getRedisKey(buildPlanKeyStable(user.userId, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('POST /api/workouts/add creates User B plan, returns schema, asserts DB and Redis', async () => {
    const user = await workoutUser('plan_add');
    const response = await request(app.getHttpServer()).post('/api/workouts/add').set(authHeaders(user.accessToken)).send({
      tz: 'Asia/Jerusalem',
      workoutName: 'Controller Plan',
      workoutData: {
        A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
        B: [{ id: 12, sets: [10, 10], order_index: 0 }],
      },
    });

    expect(response.status).toBe(201);
    expectSchema(addWorkoutResponseSchema, response.body);
    expect(response.body.message).toBe('Workout created successfully!');
    expect(response.body.workoutPlan.name).toBe('Controller Plan');
    expect(response.body.workoutPlanForEditWorkout).toHaveProperty('A');
    expect(await getActiveWorkoutSplitNames(user.userId)).toEqual(['A', 'B']);
    expect(await getRedisKey(buildPlanKeyStable(user.userId, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('GET /api/workouts/getworkout returns User B plan from Redis on repeated reads', async () => {
    const user = await workoutUser('plan_cache');
    await request(app.getHttpServer()).post('/api/workouts/add').set(authHeaders(user.accessToken)).send({
      tz: 'Asia/Jerusalem',
      workoutName: 'Cache Plan',
      workoutData: { A: [{ id: 20, sets: [5, 5], order_index: 0 }] },
    });

    const first = await request(app.getHttpServer())
      .get('/api/workouts/getworkout')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    const second = await request(app.getHttpServer())
      .get('/api/workouts/getworkout')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.headers['x-cache']).toBe('HIT');
    expect(second.headers['x-cache']).toBe('HIT');
    expectSchema(getWholeUserWorkoutPlanResponseSchema, second.body);
  });

  it('POST /api/workouts/add rejects invalid empty splits with 400', async () => {
    const user = await workoutUser('plan_bad');
    const response = await request(app.getHttpServer()).post('/api/workouts/add').set(authHeaders(user.accessToken)).send({
      tz: 'Asia/Jerusalem',
      workoutName: 'Bad Plan',
      workoutData: { A: [] },
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Each split must include at least one exercise');
  });

  it('GET and POST /api/workouts plan endpoints reject unauthenticated requests with 401', async () => {
    const getResponse = await request(app.getHttpServer())
      .get('/api/workouts/getworkout')
      .query({ tz: 'Asia/Jerusalem' })
      .set('x-app-version', '4.5.0');
    const postResponse = await request(app.getHttpServer()).post('/api/workouts/add').set('x-app-version', '4.5.0').send({
      tz: 'Asia/Jerusalem',
      workoutName: 'No Auth',
      workoutData: { A: [{ id: 20, sets: [1], order_index: 0 }] },
    });

    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
  });
});
