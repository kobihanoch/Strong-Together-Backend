import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { authHeaders, loginWorkoutsTestUser } from '../helpers/auth.ts';
import {
  getActiveWorkoutSplitNames,
  getExerciseToWorkoutSplitId,
  getExerciseTrackingCountForUser,
  getExercisesForSplit,
  getInactiveExercisesForSplit,
  getInactiveWorkoutSplitNames,
  getWorkoutSummaryCount,
} from '../helpers/db.ts';
import { addWorkoutPlan, finishWorkout, getTracking, getWorkoutPlan } from '../helpers/workouts.ts';

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

describe('Workouts', () => {
  it('returns null workout plan when the authenticated user has no plan', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getWorkoutPlan(app, accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ workoutPlan: null });
  });

  it('adds a workout plan and then returns it', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const addResponse = await addWorkoutPlan(app, accessToken, {
      A: [
        { id: 20, sets: 3, order_index: 0 },
        { id: 21, sets: [10, 10, 8], order_index: 1 },
      ],
      B: [{ id: 12, sets: 3, order_index: 0 }],
    });

    expect(addResponse.status).toBe(200);
    expect(addResponse.body.message).toBe('Workout created successfully!');
    expect(addResponse.body.workoutPlan).toBeDefined();
    expect(addResponse.body.workoutPlanForEditWorkout).toBeDefined();

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.body.workoutPlan.name).toBe('Test Workout');
    expect(getResponse.body.workoutPlan.numberofsplits).toBe('2');

    expect(getResponse.body.workoutPlanForEditWorkout).toHaveProperty('A');
    expect(getResponse.body.workoutPlanForEditWorkout).toHaveProperty('B');

    expect(getResponse.body.workoutPlanForEditWorkout.A).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 20, sets: [3], order_index: 0 }),
        expect.objectContaining({ id: 21, sets: [10, 10, 8], order_index: 1 }),
      ]),
    );

    expect(getResponse.body.workoutPlanForEditWorkout.B).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 12, sets: [3], order_index: 0 })]),
    );
  });

  it('rejects getting the workout plan without token', async () => {
    const response = await request(app).get('/api/workouts/getworkout').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  it('rejects adding a workout plan with empty workout data', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await addWorkoutPlan(app, accessToken, {});

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('workoutData has no splits');
  });

  it('returns empty tracking data when the authenticated user has no finished workouts', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app)
      .get('/api/workouts/gettracking')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(accessToken));

    expect(response.status).toBe(200);

    expect(response.body.exerciseTrackingAnalysis).toBeDefined();
    expect(response.body.exerciseTrackingAnalysis.unique_days).toBe(0);
    expect(response.body.exerciseTrackingAnalysis.most_frequent_split).toBeNull();
    expect(response.body.exerciseTrackingAnalysis.lastWorkoutDate).toBeNull();

    expect(response.body.exerciseTrackingMaps).toBeDefined();
    expect(response.body.exerciseTrackingMaps.byDate).toEqual({});
    expect(response.body.exerciseTrackingMaps.byETSId).toEqual({});
    expect(response.body.exerciseTrackingMaps.bySplitName).toEqual({});
  });

  it('rejects getting tracking without token', async () => {
    const response = await request(app).get('/api/workouts/gettracking').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  it('adds a workout plan, finishes a workout, and reflects it in tracking', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(userId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    const finishResponse = await finishWorkout(app, accessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
        notes: 'Solid set',
      },
    ]);

    expect(finishResponse.status).toBe(200);
    expect(finishResponse.body.exerciseTrackingAnalysis).toBeDefined();
    expect(finishResponse.body.exerciseTrackingMaps).toBeDefined();

    const trackingResponse = await getTracking(app, accessToken);

    expect(trackingResponse.status).toBe(200);
    expect(trackingResponse.body.exerciseTrackingAnalysis.unique_days).toBe(1);
    expect(trackingResponse.body.exerciseTrackingMaps.byETSId).toHaveProperty(String(exercisetosplitId));

    const byEtsId = trackingResponse.body.exerciseTrackingMaps.byETSId[String(exercisetosplitId)];
    expect(byEtsId).toHaveLength(1);
    expect(byEtsId[0]).toMatchObject({
      exercisetosplit_id: exercisetosplitId,
      weight: [80, 80, 75],
      reps: [8, 8, 10],
      notes: 'Solid set',
      exercise: 'Bench Press',
      splitname: 'A',
    });

    expect(await getWorkoutSummaryCount(userId)).toBe(1);
    expect(await getExerciseTrackingCountForUser(userId)).toBe(1);
  });

  it('replaces an existing workout plan and adds a new split', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: 3, order_index: 0 }],
      B: [{ id: 12, sets: 3, order_index: 0 }],
    });

    const updateResponse = await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: 3, order_index: 0 }],
      B: [{ id: 12, sets: 3, order_index: 0 }],
      C: [{ id: 26, sets: [12, 10], order_index: 0 }],
    });

    expect(updateResponse.status).toBe(200);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.workoutPlan.numberofsplits).toBe('3');
    expect(getResponse.body.workoutPlanForEditWorkout).toHaveProperty('C');
    expect(getResponse.body.workoutPlanForEditWorkout.C).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 26, sets: [12, 10], order_index: 0 })]),
    );

    expect(await getActiveWorkoutSplitNames(userId)).toEqual(['A', 'B', 'C']);
  });

  it('replaces an existing workout plan and removes a split', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: 3, order_index: 0 }],
      B: [{ id: 12, sets: 3, order_index: 0 }],
      C: [{ id: 26, sets: 4, order_index: 0 }],
    });

    const updateResponse = await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: 3, order_index: 0 }],
      B: [{ id: 12, sets: 3, order_index: 0 }],
    });

    expect(updateResponse.status).toBe(200);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.workoutPlan.numberofsplits).toBe('2');
    expect(getResponse.body.workoutPlanForEditWorkout).not.toHaveProperty('C');

    expect(await getActiveWorkoutSplitNames(userId)).toEqual(['A', 'B']);
    expect(await getInactiveWorkoutSplitNames(userId)).toContain('C');
  });

  it('replaces split exercises and deactivates removed exercises', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [
        { id: 20, sets: 3, order_index: 0 },
        { id: 21, sets: [10, 10, 8], order_index: 1 },
      ],
    });

    const updateResponse = await addWorkoutPlan(app, accessToken, {
      A: [
        { id: 21, sets: [12, 10], order_index: 0 },
        { id: 20, sets: [6, 6, 6], order_index: 1 },
      ],
    });

    expect(updateResponse.status).toBe(200);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.workoutPlanForEditWorkout.A).toEqual([
      expect.objectContaining({ id: 21, sets: [12, 10], order_index: 0 }),
      expect.objectContaining({ id: 20, sets: [6, 6, 6], order_index: 1 }),
    ]);

    expect(await getExercisesForSplit(userId, 'A')).toEqual([
      { exerciseId: 21, sets: [12, 10], orderIndex: 0 },
      { exerciseId: 20, sets: [6, 6, 6], orderIndex: 1 },
    ]);
  });

  it('deactivates removed exercises when a split is rewritten', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [
        { id: 20, sets: 3, order_index: 0 },
        { id: 21, sets: 3, order_index: 1 },
      ],
    });

    const updateResponse = await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [5, 5, 5], order_index: 0 }],
    });

    expect(updateResponse.status).toBe(200);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.workoutPlanForEditWorkout.A).toEqual([
      expect.objectContaining({ id: 20, sets: [5, 5, 5], order_index: 0 }),
    ]);

    expect(await getInactiveExercisesForSplit(userId, 'A')).toContain(21);
  });

  it('rejects finishing a workout without entries', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await finishWorkout(app, accessToken, []);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Not a valid workout');
  });

  it('fails finishing a workout without workout_start_utc because the API contract is inconsistent', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const exercisetosplitId = await getExerciseToWorkoutSplitId(userId, 'A', 20);

    expect(exercisetosplitId).not.toBeNull();

    const response = await finishWorkout(app, accessToken, [
      {
        exercisetosplit_id: exercisetosplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
        notes: 'Solid set',
      },
    ], 'Asia/Jerusalem', null, null);

    expect(response.status).toBe(500);
    expect(response.body.message).toContain('workout_start_utc');
  });
});
