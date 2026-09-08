import crypto from 'crypto';
import request from 'supertest';
import { createVerifiedTestUser, deleteUserByUsername } from './db';

type TestApp = {
  getHttpServer(): any;
};

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
