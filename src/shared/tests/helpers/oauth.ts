import request from 'supertest';
import { authHeaders } from './auth.ts';

export function proceedOAuthAuth(app: any, accessToken: string) {
  return request(app).post('/api/oauth/proceedauth').set(authHeaders(accessToken));
}
