import request from 'supertest';
import { authHeaders } from './auth.ts';

const httpServer = (app: any) => app.getHttpServer();

export function getAnalytics(app: any, accessToken: string) {
  return request(httpServer(app)).get('/api/analytics/get').set(authHeaders(accessToken));
}
