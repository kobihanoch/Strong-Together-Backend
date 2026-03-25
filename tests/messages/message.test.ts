import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { loginResponseSchema } from '../../src/validators/auth/loginResponse.schema.ts';
import { deleteMessageResponseSchema } from '../../src/validators/messages/deleteMessageResponse.schema.ts';
import { getAllUserMessagesResponseSchema } from '../../src/validators/messages/getAllUserMessagesResponse.schema.ts';
import { markMessageAsReadResponseSchema } from '../../src/validators/messages/markMessageAsReadResponse.schema.ts';
import { loginAuthTestUser, loginMessagesTestUser } from '../helpers/auth.ts';
import { expectSchema } from '../helpers/assertSchema.ts';
import { getMessageReadState, getExerciseToWorkoutSplitId, messageExists } from '../helpers/db.ts';
import { deleteMessage, getMessages, markMessageAsRead } from '../helpers/messages.ts';
import { addWorkoutPlan, finishWorkout } from '../helpers/workouts.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Messages', () => {
  // login -> get messages -> assert empty response
  it('returns an empty messages list for a user with no messages', async () => {
    const loginResponse = await loginMessagesTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getMessages(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(getAllUserMessagesResponseSchema, response.body);
    expect(response.body).toEqual({ messages: [] });
  });

  // login -> add workout plan -> finish workout -> get messages -> assert system message exists
  it('returns the workout-done system message after a real workout flow', async () => {
    const loginResponse = await loginMessagesTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(userId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    await finishWorkout(app, accessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
        notes: 'Solid set',
      },
    ]);

    const response = await getMessages(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(getAllUserMessagesResponseSchema, response.body);
    expect(response.body.messages).toHaveLength(1);
    expect(response.body.messages[0]).toMatchObject({
      subject: expect.any(String),
      msg: expect.any(String),
      is_read: false,
      sender_full_name: expect.any(String),
    });
  });

  // login -> add workout plan -> finish workout -> get messages -> mark as read -> assert response and DB state
  it('marks a user message as read and updates the database state', async () => {
    const loginResponse = await loginMessagesTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(userId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    await finishWorkout(app, accessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
      },
    ]);

    const getResponse = await getMessages(app, accessToken);
    expectSchema(getAllUserMessagesResponseSchema, getResponse.body);
    const messageId = getResponse.body.messages[0].id as string;

    const response = await markMessageAsRead(app, accessToken, messageId);

    expect(response.status).toBe(200);
    expectSchema(markMessageAsReadResponseSchema, response.body);
    expect(response.body).toEqual({ id: messageId, is_read: true });
    expect(await getMessageReadState(messageId)).toBe(true);
  });

  // login -> add workout plan -> finish workout -> get messages -> delete message -> assert response and DB deletion
  it('deletes a user message and removes it from the database', async () => {
    const loginResponse = await loginMessagesTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(userId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    await finishWorkout(app, accessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
      },
    ]);

    const getResponse = await getMessages(app, accessToken);
    expectSchema(getAllUserMessagesResponseSchema, getResponse.body);
    const messageId = getResponse.body.messages[0].id as string;

    const response = await deleteMessage(app, accessToken, messageId);

    expect(response.status).toBe(200);
    expectSchema(deleteMessageResponseSchema, response.body);
    expect(response.body).toEqual({ id: messageId });
    expect(await messageExists(messageId)).toBe(false);
  });

  // user b creates system message -> user a marks that message as read -> assert 404 and unread state is preserved
  it('rejects marking another user message as read', async () => {
    const ownerLoginResponse = await loginMessagesTestUser();
    expectSchema(loginResponseSchema, ownerLoginResponse.body);
    const ownerAccessToken = ownerLoginResponse.body.accessToken as string;
    const ownerUserId = ownerLoginResponse.body.user as string;

    await addWorkoutPlan(app, ownerAccessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(ownerUserId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    await finishWorkout(app, ownerAccessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
      },
    ]);

    const ownerMessagesResponse = await getMessages(app, ownerAccessToken);
    expectSchema(getAllUserMessagesResponseSchema, ownerMessagesResponse.body);
    const messageId = ownerMessagesResponse.body.messages[0].id as string;

    const attackerLoginResponse = await loginAuthTestUser();
    expectSchema(loginResponseSchema, attackerLoginResponse.body);
    const attackerAccessToken = attackerLoginResponse.body.accessToken as string;

    const response = await markMessageAsRead(app, attackerAccessToken, messageId);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Message not found');
    expect(await getMessageReadState(messageId)).toBe(false);
  });

  // user b creates system message -> user a deletes that message -> assert 404 and row still exists
  it('rejects deleting another user message', async () => {
    const ownerLoginResponse = await loginMessagesTestUser();
    expectSchema(loginResponseSchema, ownerLoginResponse.body);
    const ownerAccessToken = ownerLoginResponse.body.accessToken as string;
    const ownerUserId = ownerLoginResponse.body.user as string;

    await addWorkoutPlan(app, ownerAccessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(ownerUserId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    await finishWorkout(app, ownerAccessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
      },
    ]);

    const ownerMessagesResponse = await getMessages(app, ownerAccessToken);
    expectSchema(getAllUserMessagesResponseSchema, ownerMessagesResponse.body);
    const messageId = ownerMessagesResponse.body.messages[0].id as string;

    const attackerLoginResponse = await loginAuthTestUser();
    expectSchema(loginResponseSchema, attackerLoginResponse.body);
    const attackerAccessToken = attackerLoginResponse.body.accessToken as string;

    const response = await deleteMessage(app, attackerAccessToken, messageId);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Message not found.');
    expect(await messageExists(messageId)).toBe(true);
  });

  // get messages without token -> assert 401
  it('rejects getting messages without token', async () => {
    const response = await request(app).get('/api/messages/getmessages').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> get messages without tz -> assert validation error
  it('rejects getting messages without the required tz query', async () => {
    const loginResponse = await loginMessagesTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app).get('/api/messages/getmessages').set({
      'x-app-version': '4.5.0',
      Authorization: `DPoP ${accessToken}`,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input: expected string, received undefined');
  });

  // login -> mark missing message as read -> assert 404
  it('returns 404 when marking a missing message as read', async () => {
    const loginResponse = await loginMessagesTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await markMessageAsRead(app, accessToken, '11111111-1111-1111-1111-111111111111');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Message not found');
  });

  // login -> delete missing message -> assert 404
  it('returns 404 when deleting a missing message', async () => {
    const loginResponse = await loginMessagesTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await deleteMessage(app, accessToken, '11111111-1111-1111-1111-111111111111');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Message not found.');
  });
});
