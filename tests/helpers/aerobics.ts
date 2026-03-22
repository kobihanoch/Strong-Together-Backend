import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getAerobics(app: any, accessToken: string, tz = 'Asia/Jerusalem') {
  return request(app).get('/api/aerobics/get').query({ tz }).set(authHeaders(accessToken));
}

export function addAerobicsRecord(
  app: any,
  accessToken: string,
  record: { type: string; durationMins: number; durationSec: number },
  tz = 'Asia/Jerusalem',
) {
  return request(app).post('/api/aerobics/add').set(authHeaders(accessToken)).send({
    tz,
    record,
  });
}
