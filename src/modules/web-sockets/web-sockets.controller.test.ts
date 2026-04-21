import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { generateTicketResponseSchema, loginResponseSchema } from '@strong-together/shared';
import { createApp } from '../../app';
import { authConfig } from '../../config/auth.config';
import { authHeaders } from '../../common/tests/helpers/auth';
import { expectSchema } from '../../common/tests/helpers/assert-schema';
import { cleanupTestUsers, createAndLoginTestUser } from '../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

describe('WebSocketsController', () => {
  it('POST /api/ws/generateticket returns a signed ticket with socket claims', async () => {
    const user = await createAndLoginTestUser(app, 'ws');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);

    const response = await request(app.getHttpServer())
      .post('/api/ws/generateticket')
      .set(authHeaders(user.accessToken))
      .send({ username: user.username });

    expect(response.status).toBe(201);
    expectSchema(generateTicketResponseSchema, response.body);

    const decoded = jwt.verify(response.body.ticket, authConfig.jwtSocketSecret, {
      issuer: 'strong-together',
      audience: 'socket',
    }) as jwt.JwtPayload;

    expect(decoded.id).toBe(user.userId);
    expect(decoded.username).toBe(user.username);
    expect(decoded.jti).toBeTypeOf('string');
  });

  it('POST /api/ws/generateticket rejects missing username with 400', async () => {
    const user = await createAndLoginTestUser(app, 'ws_bad');
    users.add(user.username);

    const response = await request(app.getHttpServer())
      .post('/api/ws/generateticket')
      .set(authHeaders(user.accessToken))
      .send({});

    expect(response.status).toBe(400);
  });

  it('POST /api/ws/generateticket rejects unauthenticated requests with 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/ws/generateticket')
      .set('x-app-version', '4.5.0')
      .send({ username: 'missing' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});
