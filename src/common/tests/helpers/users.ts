import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { authConfig } from '../../../config/auth.config';
import { createVerifiedTestUser, deleteUserByUsername } from './db';

type TestApp = {
  getHttpServer(): any;
};

type CreateUserOverrides = {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Unknown' | '';
};

export async function createAppUser(app: TestApp, overrides: CreateUserOverrides = {}) {
  const suffix = crypto.randomUUID().slice(0, 8);
  const username = overrides.username ?? `user_${suffix}`;
  const email = overrides.email ?? `${username}@example.com`;
  const password = overrides.password ?? 'Test1234!';
  const fullName = overrides.fullName ?? 'Test User';
  const gender = overrides.gender ?? 'Other';

  const response = await request(app.getHttpServer()).post('/api/users/create').set('x-app-version', '4.5.0').send({
    username,
    fullName,
    email,
    password,
    gender,
  });

  return {
    username,
    email,
    password,
    response,
  };
}

export async function verifyAppUser(app: TestApp, userId: string) {
  const token = jwt.sign(
    {
      sub: userId,
      typ: 'email-verify',
      jti: `verify-${crypto.randomUUID()}`,
      iss: 'strong-together',
    },
    authConfig.jwtVerifySecret,
    { expiresIn: '1h' },
  );

  return request(app.getHttpServer()).get('/api/auth/verify').query({ token }).set('x-app-version', '4.5.0');
}

export async function loginWithCredentials(app: TestApp, identifier: string, password: string) {
  return request(app.getHttpServer()).post('/api/auth/login').set('x-app-version', '4.5.0').send({
    identifier,
    password,
  });
}

export async function createAndLoginTestUser(app: TestApp, prefix = 'ctrl') {
  const suffix = crypto.randomUUID().slice(0, 8);
  const username = `${prefix}_${suffix}`;
  const email = `${username}@example.com`;
  const userId = await createVerifiedTestUser({
    username,
    email,
    fullName: 'Controller Test User',
  });
  const loginResponse = await loginWithCredentials(app, email, 'Test1234!');

  return {
    accessToken: loginResponse.body.accessToken as string,
    email,
    loginResponse,
    password: 'Test1234!',
    userId,
    username,
  };
}

export async function cleanupTestUsers(usernames: Iterable<string>) {
  await Promise.all([...usernames].map((username) => deleteUserByUsername(username)));
}
