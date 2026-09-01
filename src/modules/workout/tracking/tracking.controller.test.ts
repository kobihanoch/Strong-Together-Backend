import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  replaceWorkoutPlanResponseSchema,
  createWorkoutSessionResponseSchema,
  getWorkoutHistoryResponseSchema,
  getWorkoutStatisticsResponseSchema,
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
import { buildTrackingMapsKeyStable } from './tracking.cache';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const userIds = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all(
    [...userIds].flatMap((userId) => [
      deleteRedisKeysByPattern(`xt:tracking:maps:v1:${userId}:*`),
      deleteRedisKeysByPattern(`xt:tracking:stats:v1:${userId}:*`),
    ]),
  );
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
  const response = await request(app.getHttpServer())
    .put('/api/workout-plan')
    .set(authHeaders(user.accessToken))
    .send({
      tz: 'Asia/Jerusalem',
      workoutName: 'Tracking Plan',
      workoutData: [
        { name: 'A', orderIndex: 0, exercises: [{ exerciseId: 20, sets: [8, 8, 10], orderIndex: 0 }] },
      ],
    });
  expect(response.status).toBe(201);
  expectSchema(replaceWorkoutPlanResponseSchema, response.body);
  const etsId = await getExerciseToWorkoutSplitId(user.userId, 'A', 20);
  expect(etsId).not.toBeNull();
  return etsId!;
}

function recentWorkoutWindow() {
  const end = new Date();
  const start = new Date(end.getTime() - 45 * 60 * 1000);
  return {
    workoutStartUtc: start.toISOString(),
    workoutEndUtc: end.toISOString(),
  };
}

describe('WorkoutTrackingController', () => {
  it('GET /api/workout-history returns User A empty tracking and warms Redis', async () => {
    const user = await trackingUser('tracking_empty');
    const response = await request(app.getHttpServer())
      .get('/api/workout-history')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.headers['x-cache']).toBe('MISS');
    expectSchema(getWorkoutHistoryResponseSchema, response.body);
    expect(response.body.byDate).toEqual({});
    expect(await getRedisKey(buildTrackingMapsKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('GET /api/workout-history returns User B schema-valid empty tracking when plan exists but no tracking', async () => {
    const user = await trackingUser('tracking_plan');
    await addPlan(user);

    const response = await request(app.getHttpServer())
      .get('/api/workout-statistics')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(getWorkoutStatisticsResponseSchema, response.body);
    expect(response.body.workoutCount).toBe(0);
    expect(await getWorkoutSummaryCount(user.userId)).toBe(0);
  });

  it('GET /api/workout-statistics advances from the latest workout summary outside the 45-day window', async () => {
    const user = await trackingUser('tracking_next_split');
    const planResponse = await request(app.getHttpServer())
      .put('/api/workout-plan')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutName: 'Ordered Tracking Plan',
        workoutData: [
          { name: 'A', orderIndex: 0, exercises: [{ exerciseId: 20, sets: [8], orderIndex: 0 }] },
          { name: 'B', orderIndex: 1, exercises: [{ exerciseId: 12, sets: [10], orderIndex: 0 }] },
        ],
      });
    expect(planResponse.status).toBe(201);

    const emptyStatsResponse = await request(app.getHttpServer())
      .get('/api/workout-statistics')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    expect(emptyStatsResponse.status).toBe(200);
    expect(emptyStatsResponse.body.nextWorkoutSplit).toMatchObject({ name: 'A', orderIndex: 0 });

    const splitAExerciseId = await getExerciseToWorkoutSplitId(user.userId, 'A', 20);
    expect(splitAExerciseId).not.toBeNull();
    const oldWorkoutStart = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const oldWorkoutEnd = new Date(oldWorkoutStart.getTime() + 45 * 60 * 1000);
    const finishResponse = await request(app.getHttpServer())
      .post('/api/workout-sessions')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutStartUtc: oldWorkoutStart.toISOString(),
        workoutEndUtc: oldWorkoutEnd.toISOString(),
        workout: [
          {
            isExerciseAssignedToSplit: true,
            exerciseToSplitId: splitAExerciseId,
            exerciseId: 20,
            trackedSets: [{ weight: 80, reps: 8, setIndex: 0 }],
          },
        ],
      });

    expect(finishResponse.status).toBe(201);
    expect(finishResponse.body.hasExerciseTracking).toBeUndefined();
    expect(finishResponse.body.trackingStats.hasExerciseTracking).toBe(false);
    expect(finishResponse.body.trackingStats.nextWorkoutSplit).toMatchObject({ name: 'B', orderIndex: 1 });
  });

  it('POST /api/workout-sessions creates User C tracking, DB rows, system message, and Redis cache', async () => {
    const user = await trackingUser('tracking_finish');
    const etsId = await addPlan(user);
    const workoutWindow = recentWorkoutWindow();

    const response = await request(app.getHttpServer())
      .post('/api/workout-sessions')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        ...workoutWindow,
        workout: [
          {
            isExerciseAssignedToSplit: true,
            exerciseToSplitId: etsId,
            trackedSets: [
              { weight: 80, reps: 8, setIndex: 0 },
              { weight: 80, reps: 8, setIndex: 1 },
              { weight: 75, reps: 10, setIndex: 2 },
            ],
            notes: 'Solid set',
          },
        ],
      });

    expect(response.status).toBe(201);
    expectSchema(createWorkoutSessionResponseSchema, response.body);
    expect(response.body.trackingStats.workoutCount).toBe(1);
    expect(response.body.trackingMaps.byExerciseToSplitId).toHaveProperty(String(etsId));
    expect(await getWorkoutSummaryCount(user.userId)).toBe(1);
    expect(await getExerciseTrackingCountForUser(user.userId)).toBe(1);
    expect(await getRedisKey(buildTrackingMapsKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('POST /api/workout-sessions rejects empty workouts with 400 and no DB inserts', async () => {
    const user = await trackingUser('tracking_bad');
    const response = await request(app.getHttpServer())
      .post('/api/workout-sessions')
      .set(authHeaders(user.accessToken))
      .send({
        tz: 'Asia/Jerusalem',
        workoutStartUtc: '2026-03-22T10:00:00.000Z',
        workoutEndUtc: '2026-03-22T10:45:00.000Z',
        workout: [],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Not a valid workout');
    expect(await getWorkoutSummaryCount(user.userId)).toBe(0);
  });

  it('GET and POST /api/workouts tracking endpoints reject unauthenticated requests with 401', async () => {
    const getResponse = await request(app.getHttpServer())
      .get('/api/workout-history')
      .query({ tz: 'Asia/Jerusalem' })
      .set('x-app-version', '4.5.0');
    const postResponse = await request(app.getHttpServer())
      .post('/api/workout-sessions')
      .set('x-app-version', '4.5.0')
      .send({ tz: 'Asia/Jerusalem', workout: [] });

    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
  });
});
