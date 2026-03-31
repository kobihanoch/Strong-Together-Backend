import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getBootstrap(app: any, accessToken: string, tz = 'Asia/Jerusalem') {
  return request(app).get('/api/bootstrap/get').query({ tz }).set(authHeaders(accessToken));
}
