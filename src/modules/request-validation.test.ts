import { describe, expect, it } from 'vitest';
import {
  createAerobicEntryRequestSchema,
  createCrewRequestSchema,
  createPostRequestSchema,
  createVideoUploadUrlRequestSchema,
  createWorkoutSessionRequestSchema,
  replaceWorkoutPlanRequestSchema,
  replaceWorkoutSchedulesRequestSchema,
  updateCurrentUserRequestSchema,
} from '@strong-together/shared';

describe('request contract validation', () => {
  it('rejects invalid workout-plan collections and values', () => {
    const parse = (workoutData: unknown) =>
      replaceWorkoutPlanRequestSchema.safeParse({ body: { workoutData, tz: 'UTC' } }).success;

    expect(parse([{ name: ' ', orderIndex: 0, exercises: [{ exerciseId: 1, sets: [8], orderIndex: 0 }] }])).toBe(false);
    expect(parse([{ name: 'A', orderIndex: 0, exercises: [{ exerciseId: 1, sets: [], orderIndex: 0 }] }])).toBe(false);
    expect(parse([{ name: 'A', orderIndex: 0, exercises: [{ exerciseId: 1, sets: [-1], orderIndex: 0 }] }])).toBe(false);
    expect(
      parse([
        { name: 'A', orderIndex: 0, exercises: [{ exerciseId: 1, sets: [8], orderIndex: 0 }] },
        { name: 'B', orderIndex: 0, exercises: [{ exerciseId: 2, sets: [8], orderIndex: 0 }] },
      ]),
    ).toBe(false);
  });

  it('rejects invalid completed workouts', () => {
    const base = {
      workoutStartUtc: '2026-01-01T12:00:00.000Z',
      workoutEndUtc: '2026-01-01T11:00:00.000Z',
      workout: [
        {
          isExerciseAssignedToSplit: false as const,
          exerciseId: 1,
          trackedSets: [{ reps: 8, weight: 20, setIndex: 0 }],
        },
      ],
    };

    expect(createWorkoutSessionRequestSchema.safeParse({ body: base }).success).toBe(false);
    expect(
      createWorkoutSessionRequestSchema.safeParse({
        body: {
          ...base,
          workoutEndUtc: '2026-01-01T13:00:00.000Z',
          workout: [{ ...base.workout[0], trackedSets: [{ reps: 0, weight: -1, setIndex: -1 }] }],
        },
      }).success,
    ).toBe(false);
  });

  it('rejects invalid aerobic durations', () => {
    expect(
      createAerobicEntryRequestSchema.safeParse({ query: {}, body: { record: { type: ' ', durationMins: 0, durationSec: 0 } } }).success,
    ).toBe(false);
    expect(
      createAerobicEntryRequestSchema.safeParse({ query: {}, body: { record: { type: 'Run', durationMins: 1, durationSec: 60 } } }).success,
    ).toBe(false);
  });

  it('rejects blank or oversized social write content', () => {
    expect(createCrewRequestSchema.safeParse({ body: { name: ' ', privacy: 'public' } }).success).toBe(false);
    expect(createPostRequestSchema.safeParse({ body: { content: ' ', visibility: 'public', crewIds: [] } }).success).toBe(false);
    expect(createPostRequestSchema.safeParse({ body: { content: 'x'.repeat(5_001), visibility: 'public', crewIds: [] } }).success).toBe(false);
  });

  it('requires at least one profile change', () => {
    expect(updateCurrentUserRequestSchema.safeParse({ body: {} }).success).toBe(false);
    expect(updateCurrentUserRequestSchema.safeParse({ body: { fullName: 'Valid User' } }).success).toBe(true);
  });

  it('restricts video upload metadata', () => {
    expect(
      createVideoUploadUrlRequestSchema.safeParse({ body: { exercise: 'squat', fileType: 'text/plain', jobId: 'job-1' } }).success,
    ).toBe(false);
    expect(
      createVideoUploadUrlRequestSchema.safeParse({ body: { exercise: 'squat', fileType: 'video/mp4', jobId: 'job-1' } }).success,
    ).toBe(true);
  });

  it('rejects duplicate schedule entries', () => {
    expect(
      replaceWorkoutSchedulesRequestSchema.safeParse({
        body: {
          schedules: [
            { workoutSplitId: 1, dayOfWeek: 1, startTime: '08:00' },
            { workoutSplitId: 1, dayOfWeek: 1, startTime: '09:00' },
          ],
        },
      }).success,
    ).toBe(false);
  });
});
