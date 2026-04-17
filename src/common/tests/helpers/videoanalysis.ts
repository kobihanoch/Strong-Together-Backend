import request from 'supertest';
import { authHeaders } from './auth.ts';

const httpServer = (app: any) => app.getHttpServer();

export function getPresignedUrl(app: any, accessToken: string, exercise: string, fileType: string, jobId: string) {
  return request(httpServer(app)).post('/api/videoanalysis/getpresignedurl').set(authHeaders(accessToken)).send({
    exercise,
    fileType,
    jobId,
  });
}
