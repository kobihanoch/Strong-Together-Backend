import request from 'supertest';
import { createApp } from '../../src/app.ts';

async function login(identifier: string) {
  const app = createApp();

  return request(app).post('/api/auth/login').set('x-app-version', '4.5.0').send({
    identifier,
    password: 'Test1234!',
  });
}

export async function loginAuthTestUser() {
  return login('auth_test_user@example.com');
}

export async function loginUsersTestUser() {
  return login('users_test_user@example.com');
}

export async function loginWorkoutsTestUser() {
  return login('workouts_test_user@example.com');
}

export async function loginBootstrapTestUser() {
  return login('bootstrap_test_user@example.com');
}

export async function loginBootstrapFlowUser() {
  return login('bootstrap_flow_user@example.com');
}

export async function loginBootstrapAerobicsUser() {
  return login('bootstrap_aerobics_user@example.com');
}

export async function loginTestUser() {
  return loginAuthTestUser();
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
