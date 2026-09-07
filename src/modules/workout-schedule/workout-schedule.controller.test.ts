import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getWorkoutSchedulesResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { getWorkoutSplitId } from '../../common/tests/helpers/db';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';
import { replaceWorkoutPlan } from '../../common/tests/helpers/workouts';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

async function scheduledWorkoutUser(prefix: string) {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  const planResponse = await replaceWorkoutPlan(app, user.accessToken, {
    Push: [{ id: 20, sets: [8, 8] }],
    Pull: [{ id: 12, sets: [10, 10] }],
  });
  expect(planResponse.status).toBe(204);

  const pushSplitId = await getWorkoutSplitId(user.userId, 'Push');
  const pullSplitId = await getWorkoutSplitId(user.userId, 'Pull');
  expect(pushSplitId).not.toBeNull();
  expect(pullSplitId).not.toBeNull();
  return { ...user, pushSplitId: pushSplitId!, pullSplitId: pullSplitId! };
}

describe('WorkoutScheduleController', () => {
  it('GET /api/workout-schedules returns an empty schema-valid schedule', async () => {
    const user = await createAndLoginTestUser(app, 'schedule_empty');
    users.add(user.username);

    const response = await request(app.getHttpServer()).get('/api/workout-schedules').set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(getWorkoutSchedulesResponseSchema, response.body);
    expect(response.body).toEqual({ schedules: [] });
  });

  it('PUT replaces the complete schedule and GET returns it in weekday/time order', async () => {
    const user = await scheduledWorkoutUser('schedule_replace');
    const headers = authHeaders(user.accessToken);

    const createResponse = await request(app.getHttpServer())
      .put('/api/workout-schedules')
      .set(headers)
      .send({
        schedules: [
          { workoutSplitId: user.pullSplitId, dayOfWeek: 4, startTime: '18:30' },
          { workoutSplitId: user.pushSplitId, dayOfWeek: 1, startTime: '07:15' },
        ],
      });
    expect(createResponse.status).toBe(204);
    expect(createResponse.text).toBe('');

    const getResponse = await request(app.getHttpServer()).get('/api/workout-schedules').set(headers);
    expect(getResponse.status).toBe(200);
    expectSchema(getWorkoutSchedulesResponseSchema, getResponse.body);
    expect(getResponse.body.schedules).toMatchObject([
      { userId: user.userId, workoutSplitId: user.pushSplitId, dayOfWeek: 1, startTime: '07:15:00' },
      { userId: user.userId, workoutSplitId: user.pullSplitId, dayOfWeek: 4, startTime: '18:30:00' },
    ]);

    const replaceResponse = await request(app.getHttpServer())
      .put('/api/workout-schedules')
      .set(headers)
      .send({ schedules: [{ workoutSplitId: user.pullSplitId, dayOfWeek: 2, startTime: '19:00' }] });
    expect(replaceResponse.status).toBe(204);

    const replaced = await request(app.getHttpServer()).get('/api/workout-schedules').set(headers);
    expect(replaced.body.schedules).toHaveLength(1);
    expect(replaced.body.schedules[0]).toMatchObject({ workoutSplitId: user.pullSplitId, dayOfWeek: 2, startTime: '19:00:00' });
  });

  it('PUT with an empty schedules array clears the weekly schedule', async () => {
    const user = await scheduledWorkoutUser('schedule_clear');
    const headers = authHeaders(user.accessToken);
    await request(app.getHttpServer())
      .put('/api/workout-schedules')
      .set(headers)
      .send({ schedules: [{ workoutSplitId: user.pushSplitId, dayOfWeek: 1, startTime: '08:00' }] })
      .expect(204);

    await request(app.getHttpServer()).put('/api/workout-schedules').set(headers).send({ schedules: [] }).expect(204);

    const response = await request(app.getHttpServer()).get('/api/workout-schedules').set(headers);
    expect(response.body).toEqual({ schedules: [] });
  });

  it('PUT rejects malformed, duplicate, and another user\'s schedule entries without replacing existing rows', async () => {
    const user = await scheduledWorkoutUser('schedule_invalid');
    const other = await scheduledWorkoutUser('schedule_other');
    const headers = authHeaders(user.accessToken);
    const original = { workoutSplitId: user.pushSplitId, dayOfWeek: 1, startTime: '08:00' };
    await request(app.getHttpServer()).put('/api/workout-schedules').set(headers).send({ schedules: [original] }).expect(204);

    const malformedResponses = await Promise.all([
      request(app.getHttpServer()).put('/api/workout-schedules').set(headers).send({}),
      request(app.getHttpServer())
        .put('/api/workout-schedules')
        .set(headers)
        .send({ schedules: [{ ...original, dayOfWeek: 7 }] }),
      request(app.getHttpServer())
        .put('/api/workout-schedules')
        .set(headers)
        .send({ schedules: [{ ...original, startTime: '25:00' }] }),
      request(app.getHttpServer())
        .put('/api/workout-schedules')
        .set(headers)
        .send({ schedules: [original, original] }),
      request(app.getHttpServer())
        .put('/api/workout-schedules')
        .set(headers)
        .send({ schedules: [{ ...original, workoutSplitId: other.pushSplitId }] }),
    ]);

    expect(malformedResponses.map((response) => response.status)).toEqual([400, 400, 400, 400, 400]);
    const unchanged = await request(app.getHttpServer()).get('/api/workout-schedules').set(headers);
    expect(unchanged.body.schedules).toHaveLength(1);
    expect(unchanged.body.schedules[0]).toMatchObject({ ...original, startTime: '08:00:00' });
  });

  it('GET and PUT reject unauthenticated requests', async () => {
    const getResponse = await request(app.getHttpServer()).get('/api/workout-schedules').set('x-app-version', '4.5.0');
    const putResponse = await request(app.getHttpServer())
      .put('/api/workout-schedules')
      .set('x-app-version', '4.5.0')
      .send({ schedules: [] });

    expect(getResponse.status).toBe(401);
    expect(putResponse.status).toBe(401);
  });
});
