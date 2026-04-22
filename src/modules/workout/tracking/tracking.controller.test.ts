import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  addWorkoutResponseSchema,
  finishUserWorkoutResponseSchema,
  getExerciseTrackingResponseSchema,
  loginResponseSchema,
} from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import {
  getExerciseToWorkoutSplitId,
  getExerciseTrackingCountForUser,
  getWorkoutSummaryCount,
} from '../../../common/tests/helpers/db';
import { deleteRedisKeysByPattern, getRedisKey } from '../../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../../common/tests/helpers/users';
import { buildTrackingKeyStable } from './tracking.cache';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const userIds = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all([...userIds].map((userId) => deleteRedisKeysByPattern(`xt:tracking:v1:${userId}:*`)));
  await cleanupTestUsers(users);
  users.clear();
  userIds.clear();
});

async function trackingUser(prefix = 'tracking') {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  userIds.add(user.userId);
  expectSchema(loginResponseSchema, user.loginResponse.body);
  return user;
}

async function addPlan(user: Awaited<ReturnType<typeof trackingUser>>) {
  const response = await request(app.getHttpServer()).post('/api/workouts/add').set(authHeaders(user.accessToken)).send({
    tz: 'Asia/Jerusalem',
    workoutName: 'Tracking Plan',
    workoutData: { A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }] },
  });
  expect(response.status).toBe(201);
  expectSchema(addWorkoutResponseSchema, response.body);
  const etsId = await getExerciseToWorkoutSplitId(user.userId, 'A', 20);
  expect(etsId).not.toBeNull();
  return etsId!;
}

describe('WorkoutTrackingController', () => {
  it('GET /api/workouts/gettracking returns User A empty tracking and warms Redis', async () => {
    const user = await trackingUser('tracking_empty');
    const response = await request(app.getHttpServer())
      .get('/api/workouts/gettracking')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.headers['x-cache']).toBe('MISS');
    expectSchema(getExerciseTrackingResponseSchema, response.body);
    expect(response.body.exerciseTrackingAnalysis.unique_days).toBe(0);
    expect(response.body.exerciseTrackingMaps.byDate).toEqual({});
    expect(await getRedisKey(buildTrackingKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('GET /api/workouts/gettracking returns User B schema-valid empty tracking when plan exists but no tracking', async () => {
    const user = await trackingUser('tracking_plan');
    await addPlan(user);

    const response = await request(app.getHttpServer())
      .get('/api/workouts/gettracking')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(getExerciseTrackingResponseSchema, response.body);
    expect(response.body.exerciseTrackingAnalysis.unique_days).toBe(0);
    expect(await getWorkoutSummaryCount(user.userId)).toBe(0);
  });

  it('POST /api/workouts/finishworkout creates User C tracking, DB rows, system message, and Redis cache', async () => {
    const user = await trackingUser('tracking_finish');
    const etsId = await addPlan(user);

    const response = await request(app.getHttpServer()).post('/api/workouts/finishworkout').set(authHeaders(user.accessToken)).send({
      tz: 'Asia/Jerusalem',
      workout_start_utc: '2026-03-22T10:00:00.000Z',
      workout_end_utc: '2026-03-22T10:45:00.000Z',
      workout: [{ exercisetosplit_id: etsId, weight: [80, 80, 75], reps: [8, 8, 10], notes: 'Solid set' }],
    });

    expect(response.status).toBe(201);
    expectSchema(finishUserWorkoutResponseSchema, response.body);
    expect(response.body.exerciseTrackingAnalysis.unique_days).toBe(1);
    expect(response.body.exerciseTrackingMaps.byETSId).toHaveProperty(String(etsId));
    expect(await getWorkoutSummaryCount(user.userId)).toBe(1);
    expect(await getExerciseTrackingCountForUser(user.userId)).toBe(1);
    expect(await getRedisKey(buildTrackingKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('POST /api/workouts/finishworkout rejects empty workouts with 400 and no DB inserts', async () => {
    const user = await trackingUser('tracking_bad');
    const response = await request(app.getHttpServer()).post('/api/workouts/finishworkout').set(authHeaders(user.accessToken)).send({
      tz: 'Asia/Jerusalem',
      workout_start_utc: '2026-03-22T10:00:00.000Z',
      workout_end_utc: '2026-03-22T10:45:00.000Z',
      workout: [],
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Not a valid workout');
    expect(await getWorkoutSummaryCount(user.userId)).toBe(0);
  });

  it('GET and POST /api/workouts tracking endpoints reject unauthenticated requests with 401', async () => {
    const getResponse = await request(app.getHttpServer())
      .get('/api/workouts/gettracking')
      .query({ tz: 'Asia/Jerusalem' })
      .set('x-app-version', '4.5.0');
    const postResponse = await request(app.getHttpServer())
      .post('/api/workouts/finishworkout')
      .set('x-app-version', '4.5.0')
      .send({ tz: 'Asia/Jerusalem', workout: [] });

    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
  });
});
