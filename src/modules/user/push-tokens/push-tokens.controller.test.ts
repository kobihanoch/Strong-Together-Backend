import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getAuthenticatedUserByIdResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import { getUserSessionStateByUsername } from '../../../common/tests/helpers/db';
import { cleanupTestUsers, createAndLoginTestUser } from '../../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

describe('PushTokensController', () => {
  it('PUT /api/users/pushtoken persists push token in DB and user response schema remains valid', async () => {
    const user = await createAndLoginTestUser(app, 'push_token');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);
    const token = 'ExponentPushToken[controller-test-token]';

    const response = await request(app.getHttpServer()).put('/api/users/pushtoken').set(authHeaders(user.accessToken)).send({ token });
    const getResponse = await request(app.getHttpServer()).get('/api/users/get').set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(await getUserSessionStateByUsername(user.username)).toMatchObject({ pushToken: token });
    expect(getResponse.status).toBe(200);
    expectSchema(getAuthenticatedUserByIdResponseSchema, getResponse.body);
    expect(getResponse.body.push_token).toBe(token);
  });

  it('PUT /api/users/pushtoken rejects bad payloads with 400 and unauthenticated requests with 401', async () => {
    const user = await createAndLoginTestUser(app, 'push_bad');
    users.add(user.username);
    const bad = await request(app.getHttpServer()).put('/api/users/pushtoken').set(authHeaders(user.accessToken)).send({});
    const noAuth = await request(app.getHttpServer())
      .put('/api/users/pushtoken')
      .set('x-app-version', '4.5.0')
      .send({ token: 'ExponentPushToken[test]' });

    expect(bad.status).toBe(400);
    expect(noAuth.status).toBe(401);
  });
});
