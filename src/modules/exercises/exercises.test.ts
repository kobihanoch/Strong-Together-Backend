import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../app.ts';
import { loginResponseSchema, getAllExercisesResponseSchema } from '@strong-together/shared';
import { loginTestUser } from '../../shared/tests/helpers/auth.ts';
import { expectSchema } from '../../shared/tests/helpers/assert-schema.ts';
import { getAllExercises } from '../../shared/tests/helpers/exercises.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Exercises', () => {
  // login -> get all exercises -> assert grouped map structure and known seeded exercises
  it('returns the full exercise map grouped by target muscle', async () => {
    const loginResponse = await loginTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getAllExercises(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(getAllExercisesResponseSchema, response.body);
    expect(response.body).toBeTypeOf('object');
    expect(Object.keys(response.body).length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('Chest');
    expect(response.body.Chest).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 20,
          name: 'Bench Press',
          specificTargetMuscle: 'Major',
        }),
        expect.objectContaining({
          id: 21,
          name: 'Incline Bench Press',
          specificTargetMuscle: 'Major',
        }),
      ]),
    );
  });

  // get all exercises without token -> assert 401
  it('rejects exercises access without token', async () => {
    const response = await request(app).get('/api/exercises/getall').set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});

