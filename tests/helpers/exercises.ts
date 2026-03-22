import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getAllExercises(app: any, accessToken: string) {
  return request(app).get('/api/exercises/getall').set(authHeaders(accessToken));
}
