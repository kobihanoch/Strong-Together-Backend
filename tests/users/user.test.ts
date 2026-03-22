import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { authHeaders, createChangeEmailToken, loginUsersTestUser } from '../helpers/auth.ts';
import { getUserAuthStateByUsername, hasReminderSettings } from '../helpers/db.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Users', () => {
  // create user -> assert api payload -> assert db row is unverified and reminder settings were created
  it('creates a new app user with default registration state', async () => {
    const suffix = crypto.randomUUID().slice(0, 8);
    const username = `user_${suffix}`;
    const email = `user_${suffix}@example.com`;

    const response = await request(app).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: '',
      email,
      password: 'Test1234!',
      gender: '',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully!');
    expect(response.body.user.id).toBeTypeOf('string');
    expect(response.body.user.username).toBe(username);
    expect(response.body.user.name).toBe('User');
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.gender).toBe('Unknown');
    expect(response.body.user.role).toBe('User');

    const createdUser = await getUserAuthStateByUsername(username);

    expect(createdUser).not.toBeNull();
    expect(createdUser?.email).toBe(email);
    expect(createdUser?.name).toBe('User');
    expect(createdUser?.gender).toBe('Unknown');
    expect(createdUser?.is_verified).toBe(false);
    expect(createdUser?.password).toBeTypeOf('string');
    expect(await bcrypt.compare('Test1234!', createdUser?.password || '')).toBe(true);
    expect(await hasReminderSettings(createdUser!.id)).toBe(true);
  });

  // login -> get authenticated user profile -> assert current user payload
  it('gets the authenticated user profile', async () => {
    const loginResponse = await loginUsersTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app).get('/api/users/get').set(authHeaders(accessToken));

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(loginResponse.body.user);
    expect(response.body.username).toBe('users_test_user');
    expect(response.body.email).toBe('users_test_user@example.com');
  });

  // login -> update self -> get authenticated user profile -> assert persisted profile changes
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

  // login -> request email update -> assert db stays unchanged until token confirmation -> confirm with token -> assert email is updated
  it('defers email updates until the confirmation token is consumed', async () => {
    const suffix = crypto.randomUUID().slice(0, 8);
    const username = `mail_${suffix}`;
    const email = `${username}@example.com`;
    const newEmail = `updated_${suffix}@example.com`;

    const createResponse = await request(app).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: 'Email Update',
      email,
      password: 'Test1234!',
      gender: 'Other',
    });

    expect(createResponse.status).toBe(201);

    const verifyToken = jwt.sign(
      {
        sub: createResponse.body.user.id,
        typ: 'email-verify',
        jti: `verify-${crypto.randomUUID()}`,
        iss: 'strong-together',
      },
      process.env.JWT_VERIFY_SECRET || '',
      { expiresIn: '1h' },
    );

    const verifyResponse = await request(app).get('/api/auth/verify').query({ token: verifyToken }).set('x-app-version', '4.5.0');
    expect(verifyResponse.status).toBe(200);

    const loginResponse = await request(app).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: email,
      password: 'Test1234!',
    });

    expect(loginResponse.status).toBe(200);

    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    const beforeUpdate = await getUserAuthStateByUsername(username);
    expect(beforeUpdate).not.toBeNull();

    const updateResponse = await request(app).put('/api/users/updateself').set(authHeaders(accessToken)).send({
      email: newEmail,
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe('User updated successfully');
    expect(updateResponse.body.emailChanged).toBe(true);
    expect(updateResponse.body.user.email).toBe(beforeUpdate?.email);

    const afterRequest = await getUserAuthStateByUsername(username);
    expect(afterRequest?.email).toBe(beforeUpdate?.email);

    const token = createChangeEmailToken(userId, newEmail);
    const confirmResponse = await request(app).get('/api/users/changeemail').query({ token }).set('x-app-version', '4.5.0');

    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.headers['content-type']).toContain('text/html');

    const afterConfirm = await getUserAuthStateByUsername(username);
    expect(afterConfirm?.email).toBe(newEmail);
  });

  // get authenticated user profile without token -> assert 401
  it('rejects getting the authenticated user profile without token', async () => {
    const response = await request(app).get('/api/users/get').set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> update self with invalid payload -> assert validation error
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

  // login -> save push token -> get authenticated user profile -> assert persisted push token
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

  // save push token without token -> assert 401
  it('rejects saving push token without access token', async () => {
    const response = await request(app).put('/api/users/pushtoken').set('x-app-version', '4.5.0').send({
      token: 'ExponentPushToken[test-token-123]',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> update self with conflicting username -> assert 409
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

  // login -> delete self -> get authenticated user profile -> assert access is blocked afterward
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

  // login -> delete self -> assert the user row is actually removed from the database
  it('removes the user row from the database when deleting self', async () => {
    const suffix = crypto.randomUUID().slice(0, 8);
    const username = `delete_${suffix}`;
    const email = `${username}@example.com`;

    const createResponse = await request(app).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: 'Delete Me',
      email,
      password: 'Test1234!',
      gender: 'Male',
    });

    expect(createResponse.status).toBe(201);

    const verifyToken = jwt.sign(
      {
        sub: createResponse.body.user.id,
        typ: 'email-verify',
        jti: `verify-${crypto.randomUUID()}`,
        iss: 'strong-together',
      },
      process.env.JWT_VERIFY_SECRET || '',
      { expiresIn: '1h' },
    );

    const verifyResponse = await request(app).get('/api/auth/verify').query({ token: verifyToken }).set('x-app-version', '4.5.0');
    expect(verifyResponse.status).toBe(200);

    const loginDeleteResponse = await request(app).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: email,
      password: 'Test1234!',
    });

    expect(loginDeleteResponse.status).toBe(200);

    const deleteResponse = await request(app).delete('/api/users/deleteself').set(
      authHeaders(loginDeleteResponse.body.accessToken as string),
    );

    expect(deleteResponse.status).toBe(200);
    expect(await getUserAuthStateByUsername(username)).toBeNull();
  });

  // create user with taken username -> assert conflict is rejected before insert
  it('rejects creating a user with an existing username', async () => {
    const response = await request(app).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username: 'auth_test_user',
      fullName: 'Duplicate User',
      email: 'duplicate_create_user@example.com',
      password: 'Test1234!',
      gender: 'Male',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });
});
