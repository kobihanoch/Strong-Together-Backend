import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { addWorkoutResponseSchema } from '../../src/validators/workouts/addWorkoutResponse.schema.ts';
import { finishUserWorkoutResponseSchema } from '../../src/validators/workouts/finishUserWorkoutResponse.schema.ts';
import { getExerciseTrackingResponseSchema } from '../../src/validators/workouts/getExerciseTrackingResponse.schema.ts';
import { getWholeUserWorkoutPlanResponseSchema } from '../../src/validators/workouts/getWholeUserWorkoutPlanResponse.schema.ts';
import { loginResponseSchema } from '../../src/validators/auth/loginResponse.schema.ts';
import { createUserResponseSchema } from '../../src/validators/user/createUserResponse.schema.ts';
import { authHeaders, loginAuthTestUser, loginWorkoutsTestUser } from '../helpers/auth.ts';
import { expectSchema } from '../helpers/assertSchema.ts';
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
  // login -> get workout plan -> assert empty plan response
  it('returns null workout plan when the authenticated user has no plan', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await getWorkoutPlan(app, accessToken);

    expect(response.status).toBe(200);
    expectSchema(getWholeUserWorkoutPlanResponseSchema, response.body);
    expect(response.body).toEqual({ workoutPlan: null, workoutPlanForEditWorkout: null });
  });

  // login -> add workout plan -> get workout plan -> assert persisted plan structure
  it('adds a workout plan and then returns it', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const addResponse = await addWorkoutPlan(app, accessToken, {
      A: [
        { id: 20, sets: [3], order_index: 0 },
        { id: 21, sets: [10, 10, 8], order_index: 1 },
      ],
      B: [{ id: 12, sets: [3], order_index: 0 }],
    });

    expect(addResponse.status).toBe(200);
    expectSchema(addWorkoutResponseSchema, addResponse.body);
    expect(addResponse.body.message).toBe('Workout created successfully!');
    expect(addResponse.body.workoutPlan).toBeDefined();
    expect(addResponse.body.workoutPlanForEditWorkout).toBeDefined();

    const getResponse = await getWorkoutPlan(app, accessToken);
    expectSchema(getWholeUserWorkoutPlanResponseSchema, getResponse.body);

    expect(getResponse.body.workoutPlan.name).toBe('Test Workout');
    expect(getResponse.body.workoutPlan.numberofsplits).toBe(2);

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

  // get workout plan without token -> assert 401
  it('rejects getting the workout plan without token', async () => {
    const response = await request(app).get('/api/workouts/getworkout').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> add workout plan with empty payload -> assert server-side rejection
  it('rejects adding a workout plan with empty workout data', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await addWorkoutPlan(app, accessToken, {});

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('workoutData has no splits');
  });

  // login -> add workout plan with an empty split -> assert validation blocks an unusable plan
  it('rejects adding a workout plan when a split has no exercises', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await addWorkoutPlan(app, accessToken, { A: [] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Each split must include at least one exercise');
  });

  // login -> get tracking -> assert empty tracking response
  it('returns empty tracking data when the authenticated user has no finished workouts', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;

    const response = await request(app)
      .get('/api/workouts/gettracking')
      .query({ tz: 'Asia/Jerusalem' })
      .set(authHeaders(accessToken));

    expect(response.status).toBe(200);
    expectSchema(getExerciseTrackingResponseSchema, response.body);

    expect(response.body.exerciseTrackingAnalysis).toBeDefined();
    expect(response.body.exerciseTrackingAnalysis.unique_days).toBe(0);
    expect(response.body.exerciseTrackingAnalysis.most_frequent_split).toBeNull();
    expect(response.body.exerciseTrackingAnalysis.lastWorkoutDate).toBeNull();

    expect(response.body.exerciseTrackingMaps).toBeDefined();
    expect(response.body.exerciseTrackingMaps.byDate).toEqual({});
    expect(response.body.exerciseTrackingMaps.byETSId).toEqual({});
    expect(response.body.exerciseTrackingMaps.bySplitName).toEqual({});
  });

  // get tracking without token -> assert 401
  it('rejects getting tracking without token', async () => {
    const response = await request(app).get('/api/workouts/gettracking').query({ tz: 'Asia/Jerusalem' }).set({
      'x-app-version': '4.5.0',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No access token provided');
  });

  // login -> add workout plan -> finish workout -> get tracking -> assert tracking response and DB rows
  it('adds a workout plan, finishes a workout, and reflects it in tracking', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
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
    expectSchema(finishUserWorkoutResponseSchema, finishResponse.body);
    expect(finishResponse.body.exerciseTrackingAnalysis).toBeDefined();
    expect(finishResponse.body.exerciseTrackingMaps).toBeDefined();

    const trackingResponse = await getTracking(app, accessToken);

    expect(trackingResponse.status).toBe(200);
    expectSchema(getExerciseTrackingResponseSchema, trackingResponse.body);
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

  // user b creates workout plan -> user a submits user b exercisetosplit_id -> assert request is rejected and no tracking rows are created
  it('rejects finishing a workout with exercisetosplit rows that belong to another user', async () => {
    const victimLoginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, victimLoginResponse.body);
    const victimAccessToken = victimLoginResponse.body.accessToken as string;
    const victimUserId = victimLoginResponse.body.user as string;

    await addWorkoutPlan(app, victimAccessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    const foreignExerciseToSplitId = await getExerciseToWorkoutSplitId(victimUserId, 'A', 20);

    expect(foreignExerciseToSplitId).not.toBeNull();

    const attackerLoginResponse = await loginAuthTestUser();
    expectSchema(loginResponseSchema, attackerLoginResponse.body);
    const attackerAccessToken = attackerLoginResponse.body.accessToken as string;
    const attackerUserId = attackerLoginResponse.body.user as string;
    const attackerSummaryCountBefore = await getWorkoutSummaryCount(attackerUserId);
    const attackerTrackingCountBefore = await getExerciseTrackingCountForUser(attackerUserId);
    const victimSummaryCountBefore = await getWorkoutSummaryCount(victimUserId);
    const victimTrackingCountBefore = await getExerciseTrackingCountForUser(victimUserId);

    const response = await finishWorkout(app, attackerAccessToken, [
      {
        exercisetosplit_id: foreignExerciseToSplitId!,
        weight: [80, 80, 75],
        reps: [8, 8, 10],
        notes: 'Should be rejected',
      },
    ]);

    expect(response.status).toBe(500);
    expect(response.body.message).toContain('workoutsplit_id');
    expect(await getWorkoutSummaryCount(attackerUserId)).toBe(attackerSummaryCountBefore);
    expect(await getExerciseTrackingCountForUser(attackerUserId)).toBe(attackerTrackingCountBefore);
    expect(await getWorkoutSummaryCount(victimUserId)).toBe(victimSummaryCountBefore);
    expect(await getExerciseTrackingCountForUser(victimUserId)).toBe(victimTrackingCountBefore);
  });

  // login -> add workout plan -> replace plan with extra split -> get workout plan -> assert active splits
  it('replaces an existing workout plan and adds a new split', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [3], order_index: 0 }],
      B: [{ id: 12, sets: [3], order_index: 0 }],
    });

    const updateResponse = await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [3], order_index: 0 }],
      B: [{ id: 12, sets: [3], order_index: 0 }],
      C: [{ id: 26, sets: [12, 10], order_index: 0 }],
    });

    expect(updateResponse.status).toBe(200);
    expectSchema(addWorkoutResponseSchema, updateResponse.body);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expectSchema(getWholeUserWorkoutPlanResponseSchema, getResponse.body);
    expect(getResponse.body.workoutPlan.numberofsplits).toBe(3);
    expect(getResponse.body.workoutPlanForEditWorkout).toHaveProperty('C');
    expect(getResponse.body.workoutPlanForEditWorkout.C).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 26, sets: [12, 10], order_index: 0 })]),
    );

    expect(await getActiveWorkoutSplitNames(userId)).toEqual(['A', 'B', 'C']);
  });

  // login -> add workout plan -> replace plan without one split -> get workout plan -> assert inactive split
  it('replaces an existing workout plan and removes a split', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [3], order_index: 0 }],
      B: [{ id: 12, sets: [3], order_index: 0 }],
      C: [{ id: 26, sets: [4], order_index: 0 }],
    });

    const updateResponse = await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [3], order_index: 0 }],
      B: [{ id: 12, sets: [3], order_index: 0 }],
    });

    expect(updateResponse.status).toBe(200);
    expectSchema(addWorkoutResponseSchema, updateResponse.body);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expectSchema(getWholeUserWorkoutPlanResponseSchema, getResponse.body);
    expect(getResponse.body.workoutPlan.numberofsplits).toBe(2);
    expect(getResponse.body.workoutPlanForEditWorkout).not.toHaveProperty('C');

    expect(await getActiveWorkoutSplitNames(userId)).toEqual(['A', 'B']);
    expect(await getInactiveWorkoutSplitNames(userId)).toContain('C');
  });

  // login -> add workout plan -> rewrite split exercises -> get workout plan -> assert reordered exercises in DB
  it('replaces split exercises and deactivates removed exercises', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [
        { id: 20, sets: [3], order_index: 0 },
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
    expectSchema(addWorkoutResponseSchema, updateResponse.body);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expectSchema(getWholeUserWorkoutPlanResponseSchema, getResponse.body);
    expect(getResponse.body.workoutPlanForEditWorkout.A).toEqual([
      expect.objectContaining({ id: 21, sets: [12, 10], order_index: 0 }),
      expect.objectContaining({ id: 20, sets: [6, 6, 6], order_index: 1 }),
    ]);

    expect(await getExercisesForSplit(userId, 'A')).toEqual([
      { exerciseId: 21, sets: [12, 10], orderIndex: 0 },
      { exerciseId: 20, sets: [6, 6, 6], orderIndex: 1 },
    ]);
  });

  // login -> add workout plan -> rewrite split with fewer exercises -> get workout plan -> assert removed exercise is inactive
  it('deactivates removed exercises when a split is rewritten', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    expectSchema(loginResponseSchema, loginResponse.body);
    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    await addWorkoutPlan(app, accessToken, {
      A: [
        { id: 20, sets: [3], order_index: 0 },
        { id: 21, sets: [3], order_index: 1 },
      ],
    });

    const updateResponse = await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [5, 5, 5], order_index: 0 }],
    });

    expect(updateResponse.status).toBe(200);
    expectSchema(addWorkoutResponseSchema, updateResponse.body);

    const getResponse = await getWorkoutPlan(app, accessToken);

    expect(getResponse.status).toBe(200);
    expectSchema(getWholeUserWorkoutPlanResponseSchema, getResponse.body);
    expect(getResponse.body.workoutPlanForEditWorkout.A).toEqual([
      expect.objectContaining({ id: 20, sets: [5, 5, 5], order_index: 0 }),
    ]);

    expect(await getInactiveExercisesForSplit(userId, 'A')).toContain(21);
  });

  // login -> finish workout without entries -> assert validation error
  it('rejects finishing a workout without entries', async () => {
    const loginResponse = await loginWorkoutsTestUser();
    const accessToken = loginResponse.body.accessToken as string;

    const response = await finishWorkout(app, accessToken, []);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Not a valid workout');
  });

  // login -> add workout plan -> finish workout without workout_start_utc -> assert validation blocks the request before DB insert
  it('rejects finishing a workout without workout_start_utc', async () => {
    const suffix = Math.random().toString(36).slice(2, 10);
    const username = `fw_${suffix}`;
    const email = `${username}@example.com`;

    const createResponse = await request(app).post('/api/users/create').set('x-app-version', '4.5.0').send({
      username,
      fullName: 'Finish Workout',
      email,
      password: 'Test1234!',
      gender: 'Other',
    });

    expect(createResponse.status).toBe(201);
    expectSchema(createUserResponseSchema, createResponse.body);

    const verifyToken = jwt.sign(
      {
        sub: createResponse.body.user.id,
        typ: 'email-verify',
        jti: `verify-${suffix}`,
        iss: 'strong-together',
      },
      process.env.JWT_VERIFY_SECRET || '',
      { expiresIn: '1h' },
    );

    const verifyResponse = await request(app)
      .get('/api/auth/verify')
      .query({ token: verifyToken })
      .set('x-app-version', '4.5.0');
    expect(verifyResponse.status).toBe(200);

    const loginResponse = await request(app).post('/api/auth/login').set('x-app-version', '4.5.0').send({
      identifier: email,
      password: 'Test1234!',
    });

    expect(loginResponse.status).toBe(200);
    expectSchema(loginResponseSchema, loginResponse.body);

    const accessToken = loginResponse.body.accessToken as string;
    const userId = loginResponse.body.user as string;

    const addResponse = await addWorkoutPlan(app, accessToken, {
      A: [{ id: 20, sets: [8, 8, 10], order_index: 0 }],
    });

    expect(addResponse.status).toBe(200);
    expectSchema(addWorkoutResponseSchema, addResponse.body);

    const exercisetosplitId =
      addResponse.body.workoutPlan.workoutsplits?.find((split: any) => split.name === 'A')?.exercisetoworkoutsplit?.find(
        (exercise: any) => exercise.exercise === 'Bench Press',
      )?.id ?? (await getExerciseToWorkoutSplitId(userId, 'A', 20));

    expect(exercisetosplitId).not.toBeNull();

    const response = await finishWorkout(
      app,
      accessToken,
      [
        {
          exercisetosplit_id: exercisetosplitId!,
          weight: [80, 80, 75],
          reps: [8, 8, 10],
          notes: 'Solid set',
        },
      ],
      'Asia/Jerusalem',
      null,
      null,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input: expected string, received null');
  });
});
