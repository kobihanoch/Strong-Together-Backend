import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  getWorkoutHistoryResponseSchema,
  getExerciseHistoryResponseSchema,
  getWorkoutStatisticsResponseSchema,
  getPersonalRecordsResponseSchema,
  loginResponseSchema,
} from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import { getExerciseToWorkoutSplitId, getExerciseTrackingCountForUser, getWorkoutSummaryCount } from '../../../common/tests/helpers/db';
import { deleteRedisKeysByPattern, getRedisKey } from '../../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../../common/tests/helpers/users';
import { buildExerciseHistoryKeyStable, buildPersonalRecordsKeyStable, buildWorkoutHistoryKeyStable } from './tracking.cache';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const userIds = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all(
    [...userIds].flatMap((userId) => [
      deleteRedisKeysByPattern(`xt:tracking:workout-history:v*:${userId}:*`),
      deleteRedisKeysByPattern(`xt:tracking:workout-statistics:v*:${userId}:*`),
      deleteRedisKeysByPattern(`xt:tracking:exercise-history:v*:${userId}:*`),
      deleteRedisKeysByPattern(`xt:tracking:personal-records:v*:${userId}:*`),
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
      workoutData: [{ name: 'A', orderIndex: 0, exercises: [{ exerciseId: 20, sets: [8, 8, 10], orderIndex: 0 }] }],
    });
  expect(response.status).toBe(204);
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
    expect(await getRedisKey(buildWorkoutHistoryKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');

    const personalRecordsResponse = await request(app.getHttpServer())
      .get('/api/personal-records')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    expect(personalRecordsResponse.status).toBe(200);
    expect(personalRecordsResponse.headers['x-cache']).toBe('MISS');
    expectSchema(getPersonalRecordsResponseSchema, personalRecordsResponse.body);
    expect(personalRecordsResponse.body.prs).toEqual({});
    expect(await getRedisKey(buildPersonalRecordsKeyStable(user.userId, 'Asia/Jerusalem'))).toBeTypeOf('string');
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
    expect(planResponse.status).toBe(204);

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

    expect(finishResponse.status).toBe(204);
    const updatedStatsResponse = await request(app.getHttpServer())
      .get('/api/workout-statistics')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    expect(updatedStatsResponse.body.hasExerciseTracking).toBe(false);
    expect(updatedStatsResponse.body.nextWorkoutSplit).toMatchObject({ name: 'B', orderIndex: 1 });
  });

  it('POST /api/workout-sessions creates tracking, deletes related cache keys, and returns 204', async () => {
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

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(await getWorkoutSummaryCount(user.userId)).toBe(1);
    expect(await getExerciseTrackingCountForUser(user.userId)).toBe(1);
    expect(await getRedisKey(buildWorkoutHistoryKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeNull();

    const personalRecordsResponse = await request(app.getHttpServer())
      .get('/api/personal-records')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    expect(personalRecordsResponse.status).toBe(200);
    expect(personalRecordsResponse.headers['x-cache']).toBe('HIT');
    expectSchema(getPersonalRecordsResponseSchema, personalRecordsResponse.body);
    expect(Object.keys(personalRecordsResponse.body.prs)).toHaveLength(1);
    const [personalRecord] = Object.values(personalRecordsResponse.body.prs) as { workoutStartLocal: unknown }[];
    expect(personalRecord.workoutStartLocal).toBeTypeOf('string');
    expect(await getRedisKey(buildPersonalRecordsKeyStable(user.userId, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('GET /api/exercise-history groups flattened tracking by exercise assignment newest first and caches it', async () => {
    const user = await trackingUser('tracking_by_exercise');
    const etsId = await addPlan(user);
    const newerStart = new Date(Date.now() - 60 * 60 * 1000);
    const olderStart = new Date(newerStart.getTime() - 24 * 60 * 60 * 1000);

    for (const [workoutStart, weight] of [
      [olderStart, 70],
      [newerStart, 90],
    ] as const) {
      const response = await request(app.getHttpServer())
        .post('/api/workout-sessions')
        .set(authHeaders(user.accessToken))
        .send({
          tz: 'Asia/Jerusalem',
          workoutStartUtc: workoutStart.toISOString(),
          workoutEndUtc: new Date(workoutStart.getTime() + 45 * 60 * 1000).toISOString(),
          workout: [
            {
              isExerciseAssignedToSplit: true,
              exerciseToSplitId: etsId,
              trackedSets: [{ weight, reps: 8, setIndex: 0 }],
            },
          ],
        });
      expect(response.status).toBe(204);
    }

    const response = await request(app.getHttpServer())
      .get('/api/exercise-history')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.headers['x-cache']).toBe('HIT');
    expectSchema(getExerciseHistoryResponseSchema, response.body);
    const grouped = response.body.byExerciseToSplitId[String(etsId)];
    expect(grouped.durationMins).toBeUndefined();
    expect(grouped.exerciseTracked).toHaveLength(2);
    expect(grouped.exerciseTracked[0].exerciseTracking).toBeUndefined();
    expect(grouped.exerciseTracked[0].notes).toBeUndefined();
    expect(grouped.exerciseTracked[0].workoutStartLocal).toBeTypeOf('string');
    expect(grouped.exerciseTracked.map((item: { sets: { weight: number }[] }) => item.sets[0].weight)).toEqual([90, 70]);
    expect(await getRedisKey(buildExerciseHistoryKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('POST /api/workout-sessions rejects empty workouts with 400 and no DB inserts', async () => {
    const user = await trackingUser('tracking_bad');
    const response = await request(app.getHttpServer()).post('/api/workout-sessions').set(authHeaders(user.accessToken)).send({
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
    const getResponse = await request(app.getHttpServer()).get('/api/workout-history').query({ tz: 'Asia/Jerusalem' }).set('x-app-version', '4.5.0');
    const getExerciseResponse = await request(app.getHttpServer())
      .get('/api/exercise-history')
      .query({ tz: 'Asia/Jerusalem' })
      .set('x-app-version', '4.5.0');
    const getPersonalRecordsResponse = await request(app.getHttpServer()).get('/api/personal-records').set('x-app-version', '4.5.0');
    const postResponse = await request(app.getHttpServer())
      .post('/api/workout-sessions')
      .set('x-app-version', '4.5.0')
      .send({ tz: 'Asia/Jerusalem', workout: [] });

    expect(getResponse.status).toBe(401);
    expect(getExerciseResponse.status).toBe(401);
    expect(getPersonalRecordsResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
  });
});
