import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createUserResponseSchema } from '@strong-together/shared';
import { createApp } from '../../../app';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import { getUserAuthStateByUsername, hasReminderSettings } from '../../../common/tests/helpers/db';
import { cleanupTestUsers } from '../../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

describe('CreateUserController', () => {
  it('POST /api/users/create creates user, validates schema, DB row, password hash, and reminder settings', async () => {
    const username = `create_${crypto.randomUUID().slice(0, 8)}`;
    const email = `${username}@example.com`;
    users.add(username);

    const response = await request(app.getHttpServer()).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: '',
      email,
      password: 'Test1234!',
      gender: '',
    });

    expect(response.status).toBe(201);
    expectSchema(createUserResponseSchema, response.body);
    expect(response.body.user).toMatchObject({ username, email, name: 'User', gender: 'Unknown', role: 'User' });

    const created = await getUserAuthStateByUsername(username);
    expect(created?.is_verified).toBe(false);
    expect(await bcrypt.compare('Test1234!', created?.password || '')).toBe(true);
    expect(await hasReminderSettings(created!.id)).toBe(true);
  });

  it('POST /api/users/create rejects invalid or duplicate users with 400', async () => {
    const username = `dupe${crypto.randomUUID().slice(0, 8)}`;
    users.add(username);
    await request(app.getHttpServer()).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: 'Duplicate Base',
      email: `${username}@example.com`,
      password: 'Test1234!',
      gender: 'Male',
    });

    const invalid = await request(app.getHttpServer()).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username: 'ab',
      fullName: 'Bad',
      email: 'not-an-email',
      password: 'short',
      gender: 'Male',
    });
    const duplicate = await request(app.getHttpServer()).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: 'Duplicate',
      email: 'duplicate_create@example.com',
      password: 'Test1234!',
      gender: 'Male',
    });

    expect(invalid.status).toBe(400);
    expect(duplicate.status).toBe(400);
    expect(duplicate.body.message).toBe('User already exists');
  });
});
