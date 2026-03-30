import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getPresignedUrl(app: any, accessToken: string, fileName: string, fileType: string) {
  return request(app).post('/api/videoanalysis/getpresignedurl').set(authHeaders(accessToken)).send({
    fileName,
    fileType,
  });
}

export function publishVideoAnalysisJob(app: any, accessToken: string, fileKey: string, exercise: string) {
  return request(app).post('/api/videoanalysis/publishjob').set(authHeaders(accessToken)).send({
    fileKey,
    exercise,
  });
}
