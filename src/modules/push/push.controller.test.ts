import request from 'supertest';
import jwt from 'jsonwebtoken';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { clearPushQueue } from '../../common/tests/helpers/infra';
import { authConfig } from '../../config/auth.config';

let app: Awaited<ReturnType<typeof createApp>>;

beforeAll(async () => {
  app = await createApp();
}, 30000);

beforeEach(async () => {
  await clearPushQueue();
});

afterEach(async () => {
  await clearPushQueue();
});

describe('PushController', () => {
  it('rejects a missing cron JWT', async () => {
    const response = await request(app.getHttpServer()).post('/api/push-jobs/workout-reminders');

    expect(response.status).toBe(401);
  });

  it('rejects malformed tokens and tokens signed with another secret', async () => {
    const wrongSecretToken = jwt.sign({ job: 'workout-reminders' }, 'not-the-cron-secret', { expiresIn: '5m' });
    const malformed = await request(app.getHttpServer())
      .post('/api/push-jobs/workout-reminders')
      .set('Authorization', 'Bearer not-a-jwt');
    const wrongSecret = await request(app.getHttpServer())
      .post('/api/push-jobs/workout-reminders')
      .set('Authorization', `Bearer ${wrongSecretToken}`);

    expect(malformed.status).toBe(401);
    expect(wrongSecret.status).toBe(401);
  });

  it('accepts a JWT signed with the configured cron secret', async () => {
    const cronToken = jwt.sign({ job: 'workout-reminders' }, authConfig.cronJwtSecret, { expiresIn: '5m' });
    const response = await request(app.getHttpServer())
      .post('/api/push-jobs/workout-reminders')
      .set('Authorization', `Bearer ${cronToken}`);

    expect(response.status, JSON.stringify(response.body)).toBe(200);
    expect(response.body).toMatchObject({ success: true, message: 'Workout reminders enqueued' });
    expect(response.body.reminderCount).toBeTypeOf('number');
  });
});
