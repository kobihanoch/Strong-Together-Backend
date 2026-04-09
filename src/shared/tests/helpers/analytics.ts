import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getAnalytics(app: any, accessToken: string) {
  return request(app).get('/api/analytics/get').set(authHeaders(accessToken));
}
