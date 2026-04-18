import request from 'supertest';
import { authHeaders } from './auth';

const httpServer = (app: any) => app.getHttpServer();

export function getBootstrap(app: any, accessToken: string, tz = 'Asia/Jerusalem') {
  return request(httpServer(app)).get('/api/bootstrap/get').query({ tz }).set(authHeaders(accessToken));
}
