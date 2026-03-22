import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { authHeaders, loginUsersTestUser } from '../helpers/auth.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Users', () => {
  it('gets the authenticated user profile', async () => {
    const loginResponse = await loginUsersTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app).get('/api/users/get').set(authHeaders(accessToken));

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(loginResponse.body.user);
    expect(response.body.username).toBe('users_test_user');
    expect(response.body.email).toBe('users_test_user@example.com');
  });

  it('updates the authenticated user profile', async () => {
    const loginResponse = await loginUsersTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const updateResponse = await request(app).put('/api/users/updateself').set(authHeaders(accessToken)).send({
      username: 'auth_test_u2',
      fullName: 'Auth Test User U',
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe('User updated successfully');
    expect(updateResponse.body.emailChanged).toBe(false);
    expect(updateResponse.body.user.username).toBe('auth_test_u2');
    expect(updateResponse.body.user.name).toBe('Auth Test User U');

    const getResponse = await request(app).get('/api/users/get').set(authHeaders(accessToken));

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.username).toBe('auth_test_u2');
    expect(getResponse.body.name).toBe('Auth Test User U');
  });

  it('rejects getting the authenticated user profile without token', async () => {
    const response = await request(app).get('/api/users/get').set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  it('rejects updating the authenticated user profile with invalid payload', async () => {
    const loginResponse = await loginUsersTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app).put('/api/users/updateself').set(authHeaders(accessToken)).send({
      username: 'ab',
      fullName: 'Auth Test User',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username must be at least 3 characters');
  });

  it('saves the authenticated user push token', async () => {
    const loginResponse = await loginUsersTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const pushToken = 'ExponentPushToken[test-token-123]';

    const saveResponse = await request(app).put('/api/users/pushtoken').set(authHeaders(accessToken)).send({
      token: pushToken,
    });

    expect(saveResponse.status).toBe(204);

    const getResponse = await request(app).get('/api/users/get').set(authHeaders(accessToken));

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.push_token).toBe(pushToken);
  });

  it('rejects saving push token without access token', async () => {
    const response = await request(app).put('/api/users/pushtoken').set('x-app-version', '4.5.0').send({
      token: 'ExponentPushToken[test-token-123]',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  it('rejects updating the authenticated user profile with a taken username', async () => {
    const loginResponse = await loginUsersTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app).put('/api/users/updateself').set(authHeaders(accessToken)).send({
      username: 'conflict_user',
      fullName: 'Auth Test User',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Username or email already in use');
  });

  it('deletes the authenticated user and blocks further access', async () => {
    const loginResponse = await loginUsersTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const deleteResponse = await request(app).delete('/api/users/deleteself').set(authHeaders(accessToken));

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('User deleted successfully');

    const getResponse = await request(app).get('/api/users/get').set(authHeaders(accessToken));

    expect([401, 404]).toContain(getResponse.status);
    expect(['New login required', 'User not found']).toContain(getResponse.body.message);
  });
});
