import request from 'supertest';
import { authHeaders } from './auth';

const httpServer = (app: any) => app.getHttpServer();

export function proceedOAuthAuth(app: any, accessToken: string) {
  return request(httpServer(app)).post('/api/oauth/proceedauth').set(authHeaders(accessToken));
}
