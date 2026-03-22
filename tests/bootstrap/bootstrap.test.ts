import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { loginBootstrapFlowUser, loginBootstrapTestUser } from '../helpers/auth.ts';
import { getBootstrap } from '../helpers/bootstrap.ts';
import { getExerciseToWorkoutSplitId, getUserReminderTimezone } from '../helpers/db.ts';
import { addWorkoutPlan, finishWorkout } from '../helpers/workouts.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Bootstrap', () => {
  it('returns the base bootstrap structure for a new authenticated user and stores the requested timezone', async () => {
    const loginResponse = await loginBootstrapTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;
    const tz = 'Europe/London';

    const response = await getBootstrap(app, accessToken, tz);

    expect(response.status).toBe(200);

    expect(response.body.user).toMatchObject({
      id: userId,
      username: 'bootstrap_test_user',
      email: 'bootstrap_test_user@example.com',
      name: 'Bootstrap Test User',
    });

    expect(response.body.workout).toEqual({ workoutPlan: null });
    expect(response.body.tracking).toEqual({
      exerciseTrackingAnalysis: {
        unique_days: 0,
        most_frequent_split: null,
        most_frequent_split_days: null,
        lastWorkoutDate: null,
        splitDaysByName: {},
        prs: {
          pr_max: null,
        },
      },
      exerciseTrackingMaps: {
        byDate: {},
        byETSId: {},
        bySplitName: {},
      },
    });
    expect(response.body.messages).toEqual({ messages: [] });
    expect(response.body.aerobics).toEqual({ daily: {}, weekly: {} });
    expect(await getUserReminderTimezone(userId)).toBe(tz);
  });

  it('reflects workout, tracking, and workout-done message data in bootstrap after a real workout flow', async () => {
    const loginResponse = await loginBootstrapFlowUser();
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
        notes: 'Solid set',
      },
    ]);

    const response = await getBootstrap(app, accessToken);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(userId);
    expect(response.body.workout.workoutPlan).toMatchObject({
      name: 'Test Workout',
      numberofsplits: '1',
    });
    expect(response.body.workout.workoutPlanForEditWorkout).toHaveProperty('A');
    expect(response.body.workout.workoutPlanForEditWorkout.A).toEqual([
      expect.objectContaining({ id: 20, sets: [8, 8, 10], order_index: 0 }),
    ]);

    expect(response.body.tracking.exerciseTrackingAnalysis.unique_days).toBe(1);
    expect(response.body.tracking.exerciseTrackingAnalysis.most_frequent_split).toBe('A');
    expect(response.body.tracking.exerciseTrackingMaps.byETSId).toHaveProperty(String(exercisetosplitId));
    expect(response.body.tracking.exerciseTrackingMaps.byETSId[String(exercisetosplitId)][0]).toMatchObject({
      exercisetosplit_id: exercisetosplitId,
      weight: [80, 80, 75],
      reps: [8, 8, 10],
      notes: 'Solid set',
      exercise: 'Bench Press',
      splitname: 'A',
    });

    expect(response.body.messages.messages).toHaveLength(1);
    expect(response.body.messages.messages[0]).toMatchObject({
      subject: expect.any(String),
      msg: expect.any(String),
      is_read: false,
    });

    expect(response.body.aerobics).toEqual({ daily: {}, weekly: {} });
  });

  it('rejects bootstrap access without token', async () => {
    const response = await request(app).get('/api/bootstrap/get').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });
});
