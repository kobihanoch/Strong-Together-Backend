import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getWorkoutPlan(app: any, accessToken: string, tz = 'Asia/Jerusalem') {
  return request(app).get('/api/workouts/getworkout').query({ tz }).set(authHeaders(accessToken));
}

export function getTracking(app: any, accessToken: string, tz = 'Asia/Jerusalem') {
  return request(app).get('/api/workouts/gettracking').query({ tz }).set(authHeaders(accessToken));
}

export function addWorkoutPlan(
  app: any,
  accessToken: string,
  workoutData: Record<string, Array<{ id: number; sets: number[]; order_index?: number }>>,
  workoutName = 'Test Workout',
  tz = 'Asia/Jerusalem',
) {
  return request(app).post('/api/workouts/add').set(authHeaders(accessToken)).send({
    tz,
    workoutName,
    workoutData,
  });
}

export function finishWorkout(
  app: any,
  accessToken: string,
  workout: Array<{
    exercisetosplit_id: number;
    weight: number[];
    reps: number[];
    notes?: string | null;
  }>,
  tz = 'Asia/Jerusalem',
  workoutStartUtc: string | null = '2026-03-22T10:00:00.000Z',
  workoutEndUtc: string | null = '2026-03-22T10:45:00.000Z',
) {
  return request(app).post('/api/workouts/finishworkout').set(authHeaders(accessToken)).send({
    workout,
    tz,
    workout_start_utc: workoutStartUtc,
    workout_end_utc: workoutEndUtc,
  });
}
