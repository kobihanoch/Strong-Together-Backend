import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

describe('RemindersController', () => {
  it('gets and replaces reminder settings with a fixed 30-minute offset', async () => {
    const user = await createAndLoginTestUser(app, 'reminders');
    users.add(user.username);
    const headers = authHeaders(user.accessToken);

    const updateResponse = await request(app.getHttpServer()).put('/api/reminders').set(headers).send({
      reminderEnabled: true,
      timeZone: 'Asia/Jerusalem',
    });
    expect(updateResponse.status).toBe(204);

    const getResponse = await request(app.getHttpServer()).get('/api/reminders').set(headers);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.reminderSettings).toMatchObject({
      userId: user.userId,
      reminderEnabled: true,
      timeZone: 'Asia/Jerusalem',
    });
  });
});
