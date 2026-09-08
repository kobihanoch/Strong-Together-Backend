import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getReminderSettingsResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
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
  it('GET /api/reminders returns a contract-valid response for a new user', async () => {
    const user = await createAndLoginTestUser(app, 'reminders_empty');
    users.add(user.username);

    const response = await request(app.getHttpServer()).get('/api/reminders').set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(getReminderSettingsResponseSchema, response.body);
  });

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
    expectSchema(getReminderSettingsResponseSchema, getResponse.body);
    expect(getResponse.body.reminderSettings).toMatchObject({
      userId: user.userId,
      reminderEnabled: true,
      timeZone: 'Asia/Jerusalem',
    });
  });

  it('PUT /api/reminders rejects missing or invalid settings without overwriting the current settings', async () => {
    const user = await createAndLoginTestUser(app, 'reminders_invalid');
    users.add(user.username);
    const headers = authHeaders(user.accessToken);
    await request(app.getHttpServer())
      .put('/api/reminders')
      .set(headers)
      .send({ reminderEnabled: true, timeZone: 'Asia/Jerusalem' })
      .expect(204);

    const missing = await request(app.getHttpServer()).put('/api/reminders').set(headers).send({});
    const invalidTimeZone = await request(app.getHttpServer())
      .put('/api/reminders')
      .set(headers)
      .send({ reminderEnabled: false, timeZone: 'Not/A_Time_Zone' });

    expect(missing.status).toBe(400);
    expect(invalidTimeZone.status).toBe(400);
    const unchanged = await request(app.getHttpServer()).get('/api/reminders').set(headers);
    expect(unchanged.body.reminderSettings).toMatchObject({ reminderEnabled: true, timeZone: 'Asia/Jerusalem' });
  });

  it('PATCH /api/reminders/time-zone updates only the time zone', async () => {
    const user = await createAndLoginTestUser(app, 'reminders_timezone');
    users.add(user.username);
    const headers = authHeaders(user.accessToken);
    await request(app.getHttpServer())
      .put('/api/reminders')
      .set(headers)
      .send({ reminderEnabled: false, timeZone: 'Asia/Jerusalem' })
      .expect(204);

    await request(app.getHttpServer())
      .patch('/api/reminders/time-zone')
      .set(headers)
      .send({ timeZone: 'America/New_York' })
      .expect(204);

    const response = await request(app.getHttpServer()).get('/api/reminders').set(headers).expect(200);
    expect(response.body.reminderSettings).toMatchObject({
      reminderEnabled: false,
      timeZone: 'America/New_York',
    });
  });

  it('PATCH /api/reminders/time-zone rejects an invalid time zone', async () => {
    const user = await createAndLoginTestUser(app, 'reminders_timezone_invalid');
    users.add(user.username);

    await request(app.getHttpServer())
      .patch('/api/reminders/time-zone')
      .set(authHeaders(user.accessToken))
      .send({ timeZone: 'Not/A_Time_Zone' })
      .expect(400);
  });

  it('GET, PUT, and PATCH /api/reminders reject unauthenticated requests', async () => {
    const getResponse = await request(app.getHttpServer()).get('/api/reminders').set('x-app-version', '4.5.0');
    const putResponse = await request(app.getHttpServer())
      .put('/api/reminders')
      .set('x-app-version', '4.5.0')
      .send({ reminderEnabled: true, timeZone: 'Asia/Jerusalem' });
    const patchResponse = await request(app.getHttpServer())
      .patch('/api/reminders/time-zone')
      .set('x-app-version', '4.5.0')
      .send({ timeZone: 'Asia/Jerusalem' });

    expect(getResponse.status).toBe(401);
    expect(putResponse.status).toBe(401);
    expect(patchResponse.status).toBe(401);
  });
});
