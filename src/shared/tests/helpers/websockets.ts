import request from 'supertest';
import { authHeaders } from './auth.ts';

export function generateWebSocketTicket(app: any, accessToken: string, username: string) {
  return request(app).post('/api/ws/generateticket').set(authHeaders(accessToken)).send({
    username,
  });
}
