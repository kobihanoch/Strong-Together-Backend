import request from 'supertest';
import { authHeaders } from './auth.ts';

const httpServer = (app: any) => app.getHttpServer();

export function getAllExercises(app: any, accessToken: string) {
  return request(httpServer(app)).get('/api/exercises/getall').set(authHeaders(accessToken));
}
