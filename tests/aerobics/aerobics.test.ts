import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import type { UserAerobicsResponse } from '../../src/types/api/aerobics/responses.ts';
import type { WeeklyData } from '../../src/types/dto/aerobics.dto.ts';
import {
  loginAerobicsAggregateUser,
  loginAerobicsDefaultTimezoneUser,
  loginAerobicsGetUser,
  loginAerobicsTestUser,
} from '../helpers/auth.ts';
import { addAerobicsRecord, getAerobics } from '../helpers/aerobics.ts';
import { getAerobicsRowsForUser } from '../helpers/db.ts';

let app: ReturnType<typeof createApp>;

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

beforeAll(() => {
  app = createApp();
});

describe('Aerobics', () => {
  // login -> get aerobics -> assert empty response
  it('returns empty aerobics data for a user with no records', async () => {
    const loginResponse = await loginAerobicsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getAerobics(app, accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ daily: {}, weekly: {} });
  });

  // login -> add aerobics -> assert response aggregates -> assert DB row
  it('adds an aerobics record and returns it in daily and weekly aggregates', async () => {
    const loginResponse = await loginAerobicsTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    const response = await addAerobicsRecord(app, accessToken, {
      type: 'Walk',
      durationMins: 30,
      durationSec: 0,
    });

    expect(response.status).toBe(201);
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

    const rows = await getAerobicsRowsForUser(userId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      type: 'Walk',
      duration_mins: 30,
      duration_sec: 0,
    });
  });

  // login -> add aerobics -> add aerobics -> assert weekly totals -> assert DB rows
  it('keeps aggregating multiple aerobics records in the same weekly bucket', async () => {
    const loginResponse = await loginAerobicsAggregateUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addAerobicsRecord(app, accessToken, {
      type: 'Walk',
      durationMins: 20,
      durationSec: 0,
    });

    const addResponse = await addAerobicsRecord(app, accessToken, {
      type: 'Run',
      durationMins: 10,
      durationSec: 30,
    });

    expect(addResponse.status).toBe(201);
    expect(Object.keys(addResponse.body.weekly)).toHaveLength(1);
    expect(firstWeeklyBucket(addResponse.body)).toMatchObject({
      total_duration_mins: 30,
      total_duration_sec: 30,
    });
    expect(firstWeeklyBucket(addResponse.body).records).toHaveLength(2);

    const rows = await getAerobicsRowsForUser(userId);
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.type)).toEqual(['Walk', 'Run']);
    expect(rows.reduce((sum, row) => sum + row.duration_mins, 0)).toBe(30);
    expect(rows.reduce((sum, row) => sum + row.duration_sec, 0)).toBe(30);
  });

  // login -> add aerobics -> get aerobics -> assert response matches DB row
  it('returns existing aerobics aggregates through the get endpoint', async () => {
    const loginResponse = await loginAerobicsGetUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addAerobicsRecord(app, accessToken, {
      type: 'Bike',
      durationMins: 45,
      durationSec: 0,
    });

    const response = await getAerobics(app, accessToken);

    expect(response.status).toBe(200);
    expect(Object.keys(response.body.daily)).toHaveLength(1);
    expect(firstDailyBucket(response.body)).toEqual([
      expect.objectContaining({
        type: 'Bike',
        duration_mins: 45,
        duration_sec: 0,
      }),
    ]);

    const rows = await getAerobicsRowsForUser(userId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      type: 'Bike',
      duration_mins: 45,
      duration_sec: 0,
    });
  });

  // get aerobics without token -> assert 401
  it('rejects getting aerobics without token', async () => {
    const response = await request(app).get('/api/aerobics/get').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // add aerobics without token -> assert 401
  it('rejects adding aerobics without token', async () => {
    const response = await request(app).post('/api/aerobics/add').set('x-app-version', '4.5.0').send({
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

    const response = await request(app).post('/api/aerobics/add').set({
      'x-app-version': '4.5.0',
      Authorization: `DPoP ${accessToken}`,
    }).send({
      tz: 'Asia/Jerusalem',
      record: {
        type: 'Walk',
        durationMins: '30',
        durationSec: 0,
      },
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input: expected number, received string');
  });

  // login -> add aerobics -> get aerobics without tz -> assert default timezone path still returns data
  it('falls back to the default timezone when tz is omitted on get', async () => {
    const loginResponse = await loginAerobicsDefaultTimezoneUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addAerobicsRecord(app, accessToken, {
      type: 'Walk',
      durationMins: 30,
      durationSec: 0,
    });

    const response = await request(app).get('/api/aerobics/get').set({
      'x-app-version': '4.5.0',
      Authorization: `DPoP ${accessToken}`,
    });

    expect(response.status).toBe(200);
    expect(Object.keys(response.body.daily)).toHaveLength(1);
    expect(Object.keys(response.body.weekly)).toHaveLength(1);

    const rows = await getAerobicsRowsForUser(userId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      type: 'Walk',
      duration_mins: 30,
      duration_sec: 0,
    });
  });
});
