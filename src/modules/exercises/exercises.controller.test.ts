import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getAllExercisesResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { createAndLoginTestUser, cleanupTestUsers } from '../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

describe('ExercisesController', () => {
  it('GET /api/exercises/getall returns seeded exercises with the shared schema', async () => {
    const user = await createAndLoginTestUser(app, 'exercises');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);

    const response = await request(app.getHttpServer()).get('/api/exercises/getall').set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(getAllExercisesResponseSchema, response.body);
    expect(response.body.Chest).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 20,
          name: 'Bench Press',
          specificTargetMuscle: 'Major',
        }),
      ]),
    );
  });

  it('GET /api/exercises/getall rejects unauthenticated requests with 401', async () => {
    const response = await request(app.getHttpServer()).get('/api/exercises/getall').set('x-app-version', '4.5.0');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});
