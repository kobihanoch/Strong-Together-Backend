import crypto from 'crypto';
import request from 'supertest';
import jwt from 'jsonwebtoken';
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

export async function loginMessagesTestUser() {
  return login('messages_test_user@example.com');
}

export async function loginAerobicsTestUser() {
  return login('aerobics_test_user@example.com');
}

export async function loginAerobicsAggregateUser() {
  return login('aerobics_aggregate_user@example.com');
}

export async function loginAerobicsGetUser() {
  return login('aerobics_get_user@example.com');
}

export async function loginAerobicsDefaultTimezoneUser() {
  return login('aerobics_default_tz_user@example.com');
}

export async function loginAnalyticsTestUser() {
  return login('analytics_test_user@example.com');
}

export async function loginAnalyticsEmptyUser() {
  return login('analytics_empty_user@example.com');
}

export async function loginOAuthCompleteUser() {
  return login('oauth_complete_user@example.com');
}

export async function loginOAuthIncompleteUser() {
  return login('oauth_incomplete_user@example.com');
}

export async function loginTestUser() {
  return loginAuthTestUser();
}

export function createVerifyToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
      typ: 'email-verify',
      jti: `verify-${crypto.randomUUID()}`,
      iss: 'strong-together',
    },
    process.env.JWT_VERIFY_SECRET || '',
    { expiresIn: '1h' },
  );
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
