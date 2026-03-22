import request from 'supertest';
import { authHeaders } from './auth.ts';

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
