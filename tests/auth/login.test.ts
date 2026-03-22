import request from 'supertest';
import { createApp } from '../../src/app.ts';
import { authHeaders, loginTestUser, logoutHeaders, refreshHeaders } from '../helpers/auth.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Auth Login', () => {
  // login -> assert tokens and response payload
  it('logs in with valid credentials', async () => {
    const response = await loginTestUser();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toBeTypeOf('string');
    expect(response.body.accessToken).toBeTypeOf('string');
    expect(response.body.refreshToken).toBeTypeOf('string');
  });

  // login -> get authenticated user -> assert protected access works
  it('uses the access token to reach a protected route', async () => {
    const loginResponse = await loginTestUser();

    const accessToken = loginResponse.body.accessToken as string;

    const meResponse = await request(app).get('/api/users/get').set(authHeaders(accessToken));

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.id).toBe(loginResponse.body.user);
    expect(meResponse.body.username).toBe('auth_test_user');
  });

  // login -> refresh tokens -> get authenticated user with new token -> assert session refresh works
  it('refreshes tokens with a valid refresh token and uses the new access token', async () => {
    const loginResponse = await loginTestUser();

    const refreshToken = loginResponse.body.refreshToken as string;

    const refreshResponse = await request(app).post('/api/auth/refresh').set(refreshHeaders(refreshToken));

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.message).toBe('Access token refreshed');
    expect(refreshResponse.body.userId).toBe(loginResponse.body.user);
    expect(refreshResponse.body.accessToken).toBeTypeOf('string');
    expect(refreshResponse.body.refreshToken).toBeTypeOf('string');

    const meResponse = await request(app).get('/api/users/get').set(authHeaders(refreshResponse.body.accessToken));

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.id).toBe(loginResponse.body.user);
    expect(meResponse.body.username).toBe('auth_test_user');
  });

  // login -> logout -> get authenticated user with old token -> assert old session is invalidated
  it('invalidates the old session after logout', async () => {
    const loginResponse = await loginTestUser();

    const accessToken = loginResponse.body.accessToken as string;
    const refreshToken = loginResponse.body.refreshToken as string;

    const logoutResponse = await request(app).post('/api/auth/logout').set(logoutHeaders(accessToken, refreshToken));

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe('Logged out successfully');

    const meResponse = await request(app).get('/api/users/get').set(authHeaders(accessToken));

    expect(meResponse.status).toBe(401);
  });

  // login with wrong password -> assert invalid credentials
  it('rejects login with wrong password', async () => {
    const response = await request(app).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: 'auth_test_user',
      password: 'WrongPassword123!',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  // get protected route without token -> assert 401
  it('rejects protected route access without token', async () => {
    const app = createApp();

    const response = await request(app).get('/api/users/get').set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});
