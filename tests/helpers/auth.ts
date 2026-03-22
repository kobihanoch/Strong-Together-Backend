import request from 'supertest';
import { createApp } from '../../src/app.ts';

export async function loginTestUser() {
  const app = createApp();

  return request(app).post('/api/auth/login').set('x-app-version', '4.5.0').send({
    identifier: 'auth_test_user',
    password: 'Test1234!',
  });
}

export function authHeaders(accessToken: string) {
  return {
    'x-app-version': '4.5.0',
    Authorization: `DPoP ${accessToken}`,
  };
}

export function refreshHeaders(refreshToken: string) {
  return {
    'x-app-version': '4.5.0',
    'x-refresh-token': `DPoP ${refreshToken}`,
  };
}

export function logoutHeaders(accessToken: string, refreshToken: string) {
  return {
    'x-app-version': '4.5.0',
    Authorization: `Bearer ${accessToken}`,
    'x-refresh-token': `Bearer ${refreshToken}`,
  };
}
