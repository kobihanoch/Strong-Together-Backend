import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getPresignedUrl(app: any, accessToken: string, exercise: string, fileType: string, jobId: string) {
  return request(app).post('/api/videoanalysis/getpresignedurl').set(authHeaders(accessToken)).send({
    exercise,
    fileType,
    jobId,
  });
}
