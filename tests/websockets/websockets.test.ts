import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { loginResponseSchema } from '../../src/validators/auth/loginResponse.schema.ts';
import { generateTicketResponseSchema } from '../../src/validators/webSockets/generateTicketResponse.schema.ts';
import { loginTestUser } from '../helpers/auth.ts';
import { expectSchema } from '../helpers/assertSchema.ts';
import { generateWebSocketTicket } from '../helpers/websockets.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('WebSockets', () => {
  // login -> generate ticket -> decode jwt -> assert socket claims and expiry metadata
  it('returns a signed websocket ticket for an authenticated user', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    const response = await generateWebSocketTicket(app, accessToken, 'auth_test_user');

    expect(response.status).toBe(201);
    expectSchema(generateTicketResponseSchema, response.body);
    expect(response.body.ticket).toBeTypeOf('string');

    const decoded = jwt.verify(response.body.ticket, process.env.JWT_SOCKET_SECRET || '', {
      issuer: 'strong-together',
      audience: 'socket',
    }) as jwt.JwtPayload;

    expect(decoded.id).toBe(userId);
    expect(decoded.username).toBe('auth_test_user');
    expect(decoded.jti).toBeTypeOf('string');
    expect(typeof decoded.exp).toBe('number');
    expect(typeof decoded.iat).toBe('number');
    expect((decoded.exp as number) - (decoded.iat as number)).toBe(5400);
  });

  // generate ticket without token -> assert 401 from auth middleware
  it('rejects websocket ticket generation without token', async () => {
    const response = await request(app).post('/api/ws/generateticket').set({
      'x-app-version': '4.5.0',
    }).send({
      username: 'auth_test_user',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> generate ticket with missing username -> assert request validation error
  it('rejects websocket ticket generation with missing username', async () => {
    const loginResponse = await loginTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app).post('/api/ws/generateticket').set({
      'x-app-version': '4.5.0',
      Authorization: `DPoP ${accessToken}`,
    }).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input: expected string, received undefined');
  });
});
