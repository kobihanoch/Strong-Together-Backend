import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { listMessagesResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { getExerciseToWorkoutSplitId, getMessageReadState, messageExists } from '../../common/tests/helpers/db';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';
import { replaceWorkoutPlan, finishWorkout } from '../../common/tests/helpers/workouts';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

async function messageUser(prefix = 'messages') {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  expectSchema(loginResponseSchema, user.loginResponse.body);
  return user;
}

async function createWorkoutMessage(user: Awaited<ReturnType<typeof messageUser>>) {
  await replaceWorkoutPlan(app, user.accessToken, { A: [{ id: 20, sets: [8, 8, 10], orderIndex: 0 }] });
  const etsId = await getExerciseToWorkoutSplitId(user.userId, 'A', 20);
  expect(etsId).not.toBeNull();
  await finishWorkout(app, user.accessToken, [
    {
      isExerciseAssignedToSplit: true,
      exerciseToSplitId: etsId!,
      trackedSets: [{ weight: 80, reps: 8, setIndex: 0 }],
    },
  ]);
  const messages = await request(app.getHttpServer()).get('/api/messages').query({ tz: 'Asia/Jerusalem' }).set(authHeaders(user.accessToken));
  expectSchema(listMessagesResponseSchema, messages.body);
  return messages.body.messages[0].id as string;
}

describe('MessagesController', () => {
  it('GET /api/messages returns empty User A messages with schema', async () => {
    const user = await messageUser('messages_empty');
    const response = await request(app.getHttpServer()).get('/api/messages').query({ tz: 'Asia/Jerusalem' }).set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(listMessagesResponseSchema, response.body);
    expect(response.body).toEqual({ messages: [] });
  });

  it('GET /api/messages returns system message after workout DB flow', async () => {
    const user = await messageUser('messages_flow');
    const messageId = await createWorkoutMessage(user);

    expect(messageId).toBeTypeOf('string');
    expect(await messageExists(messageId)).toBe(true);
  });

  it('PATCH /api/messages/:id/read updates message state in DB', async () => {
    const user = await messageUser('messages_read');
    const messageId = await createWorkoutMessage(user);

    const response = await request(app.getHttpServer()).patch(`/api/messages/${messageId}/read`).set(authHeaders(user.accessToken));

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(await getMessageReadState(messageId)).toBe(true);
  });

  it('DELETE /api/messages/:id removes message row from DB', async () => {
    const user = await messageUser('messages_delete');
    const messageId = await createWorkoutMessage(user);

    const response = await request(app.getHttpServer()).delete(`/api/messages/${messageId}`).set(authHeaders(user.accessToken));

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(await messageExists(messageId)).toBe(false);
  });

  it('message endpoints return 400/401/404 for bad, unauthenticated, and missing resources', async () => {
    const user = await messageUser('messages_bad');
    const noTz = await request(app.getHttpServer()).get('/api/messages').set(authHeaders(user.accessToken));
    const noAuth = await request(app.getHttpServer()).get('/api/messages').query({ tz: 'Asia/Jerusalem' }).set('x-app-version', '4.5.0');
    const missing = await request(app.getHttpServer())
      .patch('/api/messages/11111111-1111-1111-8111-111111111111/read')
      .set(authHeaders(user.accessToken));

    expect(noTz.status).toBe(400);
    expect(noAuth.status).toBe(401);
    expect(missing.status).toBe(404);
  });
});
