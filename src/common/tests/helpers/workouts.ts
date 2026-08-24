import request from 'supertest';
import { authHeaders } from './auth';

const httpServer = (app: any) => app.getHttpServer();

export function addWorkoutPlan(
  app: any,
  accessToken: string,
  workoutData: Record<string, Array<{ id: number; sets: number[]; orderIndex?: number }>>,
  workoutName = 'Test Workout',
  tz = 'Asia/Jerusalem',
) {
  return request(httpServer(app)).post('/api/workouts/add').set(authHeaders(accessToken)).send({
    tz,
    workoutName,
    workoutData,
  });
}

export function finishWorkout(
  app: any,
  accessToken: string,
  workout: Array<{
    exerciseToSplitId: number;
    weight: number[];
    reps: number[];
    notes?: string | null;
  }>,
  tz = 'Asia/Jerusalem',
  workoutStartUtc: string | null = '2026-03-22T10:00:00.000Z',
  workoutEndUtc: string | null = '2026-03-22T10:45:00.000Z',
) {
  return request(httpServer(app)).post('/api/workouts/finishworkout').set(authHeaders(accessToken)).send({
    workout,
    tz,
    workoutStartUtc,
    workoutEndUtc,
  });
}
