import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { authConfig } from '../../config/auth.config.ts';
import { createApp } from '../../app.ts';
import { loginResponseSchema, createUserResponseSchema, userAerobicsResponseSchema } from '@strong-together/shared';
import type { AerobicEntity, UserAerobicsResponse, WeeklyData } from '@strong-together/shared';
import {
  loginAerobicsDefaultTimezoneUser,
  loginAerobicsGetUser,
  loginAerobicsTestUser,
} from '../../common/tests/helpers/auth.ts';
import { expectSchema } from '../../common/tests/helpers/assert-schema.ts';
import { addAerobicsRecord, getAerobics } from '../../common/tests/helpers/aerobics.ts';
import { waitForAerobicsRowsForUser } from '../../common/tests/helpers/db.ts';

let app: Awaited<ReturnType<typeof createApp>>;

function firstDailyBucket(body: UserAerobicsResponse) {
  return Object.values(body.daily)[0] ?? [];
}

function firstWeeklyBucket(body: UserAerobicsResponse): WeeklyData {
  const bucket = Object.values(body.weekly)[0];
  if (!bucket) {
    throw new Error('Expected at least one weekly bucket');
  }

  return bucket;
}

beforeAll(async () => {
  app = await createApp();
});

describe('Aerobics', () => {
  // login -> get aerobics -> assert empty response
  it('returns empty aerobics data for a user with no records', async () => {
    const loginResponse = await loginAerobicsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getAerobics(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(userAerobicsResponseSchema, response.body);
    expect(response.body).toEqual({ daily: {}, weekly: {} });
  });

  // login -> add aerobics -> assert response aggregates -> assert DB row
  it('adds an aerobics record and returns it in daily and weekly aggregates', async () => {
    const loginResponse = await loginAerobicsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    const response = await addAerobicsRecord(app, accessToken, {
      type: 'Walk',
      durationMins: 30,
      durationSec: 0,
    });

    expect(response.status).toBe(201);
    expectSchema(userAerobicsResponseSchema, response.body);
    expect(Object.keys(response.body.daily)).toHaveLength(1);
    expect(firstDailyBucket(response.body)).toEqual([
      expect.objectContaining({
        type: 'Walk',
        duration_mins: 30,
        duration_sec: 0,
      }),
    ]);

    expect(Object.keys(response.body.weekly)).toHaveLength(1);
    expect(firstWeeklyBucket(response.body)).toMatchObject({
      total_duration_mins: 30,
      total_duration_sec: 0,
      records: [
        expect.objectContaining({
          type: 'Walk',
          duration_mins: 30,
          duration_sec: 0,
          workout_time_utc: expect.any(String),
        }),
      ],
    });

    const rows = await waitForAerobicsRowsForUser(userId, 1);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      type: 'Walk',
      duration_mins: 30,
      duration_sec: 0,
    });
  });

  // login -> add aerobics -> add aerobics -> assert weekly totals -> assert DB rows
  it('keeps aggregating multiple aerobics records in the same weekly bucket', async () => {
    const suffix = Math.random().toString(36).slice(2, 10);
    const username = `aggr_${suffix}`;
    const email = `${username}@example.com`;

    const createResponse = await request(app.getHttpServer()).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: 'Aerobics Aggregate',
      email,
      password: 'Test1234!',
      gender: 'Other',
    });

    expect(createResponse.status).toBe(201);
    expectSchema(createUserResponseSchema, createResponse.body);

    const verifyToken = jwt.sign(
      {
        sub: createResponse.body.user.id,
        typ: 'email-verify',
        jti: `verify-${suffix}`,
        iss: 'strong-together',
      },
      authConfig.jwtVerifySecret,
      { expiresIn: '1h' },
    );

    const verifyResponse = await request(app.getHttpServer())
      .get('/api/auth/verify')
      .query({ token: verifyToken })
      .set('x-app-version', '4.5.0');
    expect(verifyResponse.status).toBe(200);

    const loginResponse = await request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: email,
      password: 'Test1234!',
    });

    expect(loginResponse.status).toBe(201);
    expectSchema(loginResponseSchema, loginResponse.body);

    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    const firstAddResponse = await addAerobicsRecord(app, accessToken, {
      type: 'Walk',
      durationMins: 20,
      durationSec: 0,
    });
    expect(firstAddResponse.status).toBe(201);
    expectSchema(userAerobicsResponseSchema, firstAddResponse.body);

    const addResponse = await addAerobicsRecord(app, accessToken, {
      type: 'Run',
      durationMins: 10,
      durationSec: 30,
    });

    expect(addResponse.status).toBe(201);
    expectSchema(userAerobicsResponseSchema, addResponse.body);
    expect(Object.keys(addResponse.body.weekly)).toHaveLength(1);
    expect(firstWeeklyBucket(addResponse.body)).toMatchObject({
      total_duration_mins: 30,
      total_duration_sec: 30,
    });
    expect(firstWeeklyBucket(addResponse.body).records).toHaveLength(2);

    const rows = await waitForAerobicsRowsForUser(userId, 2);
    expect(rows).toHaveLength(2);
    expect(rows.map((row: Pick<AerobicEntity, 'type'>) => row.type)).toEqual(['Walk', 'Run']);
    expect(rows.reduce((sum: number, row: Pick<AerobicEntity, 'duration_mins'>) => sum + row.duration_mins, 0)).toBe(30);
    expect(rows.reduce((sum: number, row: Pick<AerobicEntity, 'duration_sec'>) => sum + row.duration_sec, 0)).toBe(30);
  });

  // login -> add aerobics -> get aerobics -> assert response matches DB row
  it('returns existing aerobics aggregates through the get endpoint', async () => {
    const loginResponse = await loginAerobicsGetUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addAerobicsRecord(app, accessToken, {
      type: 'Bike',
      durationMins: 45,
      durationSec: 0,
    });

    const response = await getAerobics(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(userAerobicsResponseSchema, response.body);
    expect(Object.keys(response.body.daily)).toHaveLength(1);
    expect(firstDailyBucket(response.body)).toEqual([
      expect.objectContaining({
        type: 'Bike',
        duration_mins: 45,
        duration_sec: 0,
      }),
    ]);

    const rows = await waitForAerobicsRowsForUser(userId, 1);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      type: 'Bike',
      duration_mins: 45,
      duration_sec: 0,
    });
  });

  // get aerobics without token -> assert 401
  it('rejects getting aerobics without token', async () => {
    const response = await request(app.getHttpServer()).get('/api/aerobics/get').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // add aerobics without token -> assert 401
  it('rejects adding aerobics without token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/aerobics/add')
      .set('x-app-version', '4.5.0')
      .send({
        tz: 'Asia/Jerusalem',
        record: {
          type: 'Walk',
          durationMins: 30,
          durationSec: 0,
        },
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> add aerobics with invalid payload -> assert 400
  it('rejects adding aerobics with invalid payload', async () => {
    const loginResponse = await loginAerobicsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app.getHttpServer())
      .post('/api/aerobics/add')
      .set({
        'x-app-version': '4.5.0',
        Authorization: `DPoP ${accessToken}`,
      })
      .send({
        tz: 'Asia/Jerusalem',
        record: {
          type: 'Walk',
          durationMins: '30',
          durationSec: 0,
        },
      });

    expect(response.status).toBe(400);
    expect(response.body.message.toLowerCase()).toContain('number');
  });

  // login -> add aerobics -> get aerobics without tz -> assert default timezone path still returns data
  it('falls back to the default timezone when tz is omitted on get', async () => {
    const loginResponse = await loginAerobicsDefaultTimezoneUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addAerobicsRecord(app, accessToken, {
      type: 'Walk',
      durationMins: 30,
      durationSec: 0,
    });

    const response = await request(app.getHttpServer())
      .get('/api/aerobics/get')
      .set({
        'x-app-version': '4.5.0',
        Authorization: `DPoP ${accessToken}`,
      });

    expect(response.status).toBe(200);
    expectSchema(userAerobicsResponseSchema, response.body);
    expect(Object.keys(response.body.daily)).toHaveLength(1);
    expect(Object.keys(response.body.weekly)).toHaveLength(1);

    const rows = await waitForAerobicsRowsForUser(userId, 1);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      type: 'Walk',
      duration_mins: 30,
      duration_sec: 0,
    });
  });
});
