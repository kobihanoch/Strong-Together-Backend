import request from 'supertest';
import { authHeaders } from './auth.ts';

const httpServer = (app: any) => app.getHttpServer();

export function generateWebSocketTicket(app: any, accessToken: string, username: string) {
  return request(httpServer(app)).post('/api/ws/generateticket').set(authHeaders(accessToken)).send({
    username,
  });
}
