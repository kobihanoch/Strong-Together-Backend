import request from 'supertest';
import { authHeaders } from './auth';

const httpServer = (app: any) => app.getHttpServer();

export function replaceWorkoutPlan(
  app: any,
  accessToken: string,
  workoutData: Record<string, Array<{ id: number; sets: number[]; orderIndex?: number }>>,
  workoutName = 'Test Workout',
  tz = 'Asia/Jerusalem',
) {
  const splits = Object.entries(workoutData).map(([name, exercises], orderIndex) => ({
    name,
    orderIndex,
    exercises: exercises.map((exercise, exerciseIndex) => ({
      exerciseId: exercise.id,
      sets: exercise.sets,
      orderIndex: exercise.orderIndex ?? exerciseIndex,
    })),
  }));

  return request(httpServer(app)).put('/api/workout-plan').set(authHeaders(accessToken)).send({
    tz,
    workoutName,
    workoutData: splits,
  });
}

export function finishWorkout(
  app: any,
  accessToken: string,
  workout: Array<{
    isExerciseAssignedToSplit: true;
    exerciseToSplitId: number;
    exerciseId?: null;
    trackedSets: Array<{ weight: number; reps: number; setIndex: number }>;
    notes?: string | null;
  }>,
  tz = 'Asia/Jerusalem',
  workoutStartUtc: string | null = '2026-03-22T10:00:00.000Z',
  workoutEndUtc: string | null = '2026-03-22T10:45:00.000Z',
) {
  return request(httpServer(app)).post('/api/workout-sessions').set(authHeaders(accessToken)).send({
    workout,
    tz,
    workoutStartUtc,
    workoutEndUtc,
  });
}
