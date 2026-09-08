import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app';

let app: Awaited<ReturnType<typeof createApp>>;

beforeAll(async () => {
  app = await createApp();
}, 30000);

describe('AppController', () => {
  it('GET / reports that the server is running', async () => {
    const response = await request(app.getHttpServer()).get('/').set('x-app-version', '4.5.0');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Server is running...');
  });

  it('GET /health reports a healthy service', async () => {
    const response = await request(app.getHttpServer()).get('/health').set('x-app-version', '4.5.0');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
