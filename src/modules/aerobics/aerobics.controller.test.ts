import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { loginResponseSchema, userAerobicsResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { waitForAerobicsRowsForUser } from '../../common/tests/helpers/db';
import { deleteRedisKeysByPattern, getRedisKey } from '../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';
import { buildAerobicsKeyStable } from './aerobics.cache';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();
const userIds = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await Promise.all([...userIds].map((userId) => deleteRedisKeysByPattern(`xt:aerobics:v1:${userId}:*`)));
  await cleanupTestUsers(users);
  users.clear();
  userIds.clear();
});

async function aerobicUser(prefix = 'aerobics') {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  userIds.add(user.userId);
  expectSchema(loginResponseSchema, user.loginResponse.body);
  return user;
}

describe('AerobicsController', () => {
  it('GET /api/aerobics/get returns an empty schema-valid payload and warms Redis', async () => {
    const user = await aerobicUser();
    const response = await request(app.getHttpServer())
      .get('/api/aerobics/get')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.headers['x-cache']).toBe('MISS');
    expectSchema(userAerobicsResponseSchema, response.body);
    expect(response.body).toEqual({ daily: {}, weekly: {} });
    expect(await getRedisKey(buildAerobicsKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('POST /api/aerobics/add persists a record, returns aggregates, and updates Redis', async () => {
    const user = await aerobicUser();
    const response = await request(app.getHttpServer()).post('/api/aerobics/add').set(authHeaders(user.accessToken)).send({
      tz: 'Asia/Jerusalem',
      record: { type: 'Walk', durationMins: 30, durationSec: 15 },
    });

    expect(response.status).toBe(201);
    expectSchema(userAerobicsResponseSchema, response.body);
    expect(Object.values(response.body.daily)[0]).toEqual([
      expect.objectContaining({ type: 'Walk', duration_mins: 30, duration_sec: 15 }),
    ]);

    const rows = await waitForAerobicsRowsForUser(user.userId, 1);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ type: 'Walk', duration_mins: 30, duration_sec: 15 });
    expect(await getRedisKey(buildAerobicsKeyStable(user.userId, 45, 'Asia/Jerusalem'))).toBeTypeOf('string');
  });

  it('GET /api/aerobics/get returns Redis HIT on repeated reads', async () => {
    const user = await aerobicUser('aerobics_cache');

    const first = await request(app.getHttpServer())
      .get('/api/aerobics/get')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));
    const second = await request(app.getHttpServer())
      .get('/api/aerobics/get')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(user.accessToken));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.headers['x-cache']).toBe('MISS');
    expect(second.headers['x-cache']).toBe('HIT');
    expectSchema(userAerobicsResponseSchema, second.body);
  });

  it('POST /api/aerobics/add rejects invalid payloads with 400', async () => {
    const user = await aerobicUser('aerobics_bad');
    const response = await request(app.getHttpServer()).post('/api/aerobics/add').set(authHeaders(user.accessToken)).send({
      tz: 'Asia/Jerusalem',
      record: { type: 'Walk', durationMins: '30', durationSec: 0 },
    });

    expect(response.status).toBe(400);
  });

  it('GET and POST /api/aerobics reject unauthenticated requests with 401', async () => {
    const getResponse = await request(app.getHttpServer())
      .get('/api/aerobics/get')
      .query({ tz: 'Asia/Jerusalem' })
      .set('x-app-version', '4.5.0');
    const postResponse = await request(app.getHttpServer()).post('/api/aerobics/add').set('x-app-version', '4.5.0').send({
      tz: 'Asia/Jerusalem',
      record: { type: 'Walk', durationMins: 30, durationSec: 0 },
    });

    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
  });
});
