import { describe, expect, it } from 'vitest';
import { CompletedWorkoutSession } from './completed-workout-session';

const trackedSet = (setIndex = 0) => ({ reps: 10, weight: 50, setIndex });
const assignedExercise = () => ({
  isExerciseAssignedToSplit: true as const,
  exerciseToSplitId: 12,
  trackedSets: [trackedSet()],
  notes: ' Good session ',
});
const session = () => ({
  workout: [assignedExercise()],
  workoutStartUtc: '2026-09-25T10:00:00Z',
  workoutEndUtc: '2026-09-25T11:00:00Z',
});

describe('CompletedWorkoutSession', () => {
  it('creates a session and normalizes exercise notes', () => {
    const completed = new CompletedWorkoutSession(session());

    expect(completed.exercises[0]?.notes).toBe('Good session');
    expect(completed.period.endUtc).toBe('2026-09-25T11:00:00Z');
  });

  it('requires one to two hundred tracked exercises', () => {
    expect(() => new CompletedWorkoutSession({ ...session(), workout: [] })).toThrow('Workout must include at least one exercise');
    expect(() => new CompletedWorkoutSession({ ...session(), workout: Array.from({ length: 201 }, assignedExercise) })).toThrow(
      'Workout cannot include more than 200 exercises',
    );
  });

  it('requires one to one hundred sets with unique indexes per exercise', () => {
    expect(() => new CompletedWorkoutSession({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [] }] })).toThrow(
      'Each exercise must include at least one tracked set',
    );
    expect(() =>
      new CompletedWorkoutSession({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [trackedSet(), trackedSet()] }] }),
    ).toThrow('Set indexes must be unique');
  });

  it('validates performed set values', () => {
    expect(() =>
      new CompletedWorkoutSession({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [{ ...trackedSet(), reps: 0 }] }] }),
    ).toThrow('Reps must be an integer between 1 and 10000');
    expect(() =>
      new CompletedWorkoutSession({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [{ ...trackedSet(), weight: -1 }] }] }),
    ).toThrow('Weight must be between 0 and 100000');
    expect(() =>
      new CompletedWorkoutSession({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [{ ...trackedSet(), setIndex: -1 }] }] }),
    ).toThrow('Set index must be a non-negative integer');
  });

  it('supports planned and unassigned exercise references', () => {
    expect(() => new CompletedWorkoutSession(session())).not.toThrow();
    expect(() =>
      new CompletedWorkoutSession({
        ...session(),
        workout: [{ isExerciseAssignedToSplit: false, exerciseId: 20, trackedSets: [trackedSet()] }],
      }),
    ).not.toThrow();
    expect(() => new CompletedWorkoutSession({ ...session(), workout: [{ ...assignedExercise(), exerciseToSplitId: 0 }] })).toThrow(
      'Exercise-to-split ID must be a positive integer',
    );
  });

  it('requires valid ordered workout timestamps', () => {
    expect(() => new CompletedWorkoutSession({ ...session(), workoutStartUtc: 'invalid' })).toThrow(
      'Workout start must be a valid ISO datetime',
    );
    expect(() =>
      new CompletedWorkoutSession({ ...session(), workoutEndUtc: '2026-09-25T09:59:59Z' }),
    ).toThrow('Workout end must not be earlier than workout start');
  });
});
