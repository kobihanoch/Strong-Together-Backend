import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../../app.ts';
import { getAnalyticsResponseSchema } from '../../../modules/analytics/analytics.schemas.ts';
import { loginResponseSchema } from '../../../modules/auth/session/session.schemas.ts';
import { loginAnalyticsEmptyUser, loginAnalyticsTestUser } from '../helpers/auth.ts';
import { expectSchema } from '../helpers/assert-schema.ts';
import { getExerciseToWorkoutSplitId, getWorkoutSummaryCount } from '../helpers/db.ts';
import { getAnalytics } from '../helpers/analytics.ts';
import { addWorkoutPlan, finishWorkout } from '../helpers/workouts.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Analytics', () => {
  // login -> get analytics -> assert empty analytics response
  it('returns empty analytics for a user with no completed workouts', async () => {
    const loginResponse = await loginAnalyticsEmptyUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getAnalytics(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(getAnalyticsResponseSchema, response.body);
    expect(response.body).toEqual({
      _1RM: {},
      goals: {},
    });
  });

  // login -> add workout plan -> finish workouts -> get analytics -> assert 1RM and goals aggregates
  it('returns workout RMs and goal adherence after a real workout flow', async () => {
    const loginResponse = await loginAnalyticsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(userId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    await finishWorkout(app, accessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
      },
    ]);

    await finishWorkout(
      app,
      accessToken,
      [
        {
          exercisetosplit_id: exercisetosplitId!,
          weight: [85, 82.5, 80],
          reps: [6, 7, 8],
        },
      ],
      'Asia/Jerusalem',
      '2026-03-23T10:00:00.000Z',
      '2026-03-23T10:45:00.000Z',
    );

    const response = await getAnalytics(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(getAnalyticsResponseSchema, response.body);
    expect(await getWorkoutSummaryCount(userId)).toBe(2);

    expect(response.body._1RM).toHaveProperty('20');
    expect(response.body._1RM['20']).toMatchObject({
      exercise: 'Bench Press',
      pr_weight: 85,
      pr_reps: 6,
    });
    expect(response.body._1RM['20'].max_1rm).toBeGreaterThan(90);

    expect(response.body.goals).toHaveProperty('A');
    expect(response.body.goals.A).toHaveProperty('Bench Press');
    expect(response.body.goals.A['Bench Press'].planned).toBe(26);
    expect(response.body.goals.A['Bench Press'].actual).toBe(23.5);
    expect(response.body.goals.A['Bench Press'].adherence_pct).toBeCloseTo(90.3846, 3);
  });

  // get analytics without token -> assert 401
  it('rejects analytics access without token', async () => {
    const response = await request(app).get('/api/analytics/get').set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});
