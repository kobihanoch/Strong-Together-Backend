import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { loginMessagesTestUser } from '../helpers/auth.ts';
import { getMessageReadState, getExerciseToWorkoutSplitId, messageExists } from '../helpers/db.ts';
import { deleteMessage, getMessages, markMessageAsRead } from '../helpers/messages.ts';
import { addWorkoutPlan, finishWorkout } from '../helpers/workouts.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Messages', () => {
  it('returns an empty messages list for a user with no messages', async () => {
    const loginResponse = await loginMessagesTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getMessages(app, accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ messages: [] });
  });

  it('returns the workout-done system message after a real workout flow', async () => {
    const loginResponse = await loginMessagesTestUser();
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
    expect(response.body.messages).toHaveLength(1);
    expect(response.body.messages[0]).toMatchObject({
      subject: expect.any(String),
      msg: expect.any(String),
      is_read: false,
      sender_full_name: expect.any(String),
    });
  });

  it('marks a user message as read and updates the database state', async () => {
    const loginResponse = await loginMessagesTestUser();
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
    const messageId = getResponse.body.messages[0].id as string;

    const response = await markMessageAsRead(app, accessToken, messageId);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: messageId, is_read: true });
    expect(await getMessageReadState(messageId)).toBe(true);
  });

  it('deletes a user message and removes it from the database', async () => {
    const loginResponse = await loginMessagesTestUser();
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
    const messageId = getResponse.body.messages[0].id as string;

    const response = await deleteMessage(app, accessToken, messageId);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: messageId });
    expect(await messageExists(messageId)).toBe(false);
  });

  it('rejects getting messages without token', async () => {
    const response = await request(app).get('/api/messages/getmessages').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

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

  it('returns 404 when marking a missing message as read', async () => {
    const loginResponse = await loginMessagesTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await markMessageAsRead(app, accessToken, '11111111-1111-1111-1111-111111111111');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Message not found');
  });

  it('returns 404 when deleting a missing message', async () => {
    const loginResponse = await loginMessagesTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await deleteMessage(app, accessToken, '11111111-1111-1111-1111-111111111111');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Message not found.');
  });
});
