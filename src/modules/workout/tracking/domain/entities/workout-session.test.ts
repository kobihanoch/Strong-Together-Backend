import { describe, expect, it } from 'vitest';
import { WorkoutSession } from './workout-session';

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

describe('WorkoutSession', () => {
  it('creates a session and normalizes exercise notes', () => {
    const completed = WorkoutSession.create(session());
    expect(completed.exercises[0]?.notes).toBe('Good session');
    expect(completed.period.endUtc).toBe('2026-09-25T11:00:00Z');
    expect(completed.firstAssignedExerciseId).toBe(12);
  });

  it('requires one to two hundred tracked exercises', () => {
    expect(() => WorkoutSession.create({ ...session(), workout: [] })).toThrow('Workout must include at least one exercise');
    expect(() => WorkoutSession.create({ ...session(), workout: Array.from({ length: 201 }, assignedExercise) })).toThrow(
      'Workout cannot include more than 200 exercises',
    );
  });

  it('requires one to one hundred sets with unique indexes per exercise', () => {
    expect(() => WorkoutSession.create({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [] }] })).toThrow(
      'Each exercise must include at least one tracked set',
    );
    expect(() => WorkoutSession.create({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [trackedSet(), trackedSet()] }] })).toThrow(
      'Set indexes must be unique',
    );
  });

  it('validates performed set values', () => {
    expect(() => WorkoutSession.create({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [{ ...trackedSet(), reps: 0 }] }] })).toThrow(
      'Reps must be an integer between 1 and 10000',
    );
    expect(() => WorkoutSession.create({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [{ ...trackedSet(), weight: -1 }] }] })).toThrow(
      'Weight must be between 0 and 100000',
    );
    expect(() => WorkoutSession.create({ ...session(), workout: [{ ...assignedExercise(), trackedSets: [{ ...trackedSet(), setIndex: -1 }] }] })).toThrow(
      'Set index must be a non-negative integer',
    );
  });

  it('supports planned and unassigned exercise references', () => {
    expect(() => WorkoutSession.create(session())).not.toThrow();
    expect(() => WorkoutSession.create({
      ...session(),
      workout: [{ isExerciseAssignedToSplit: false, exerciseId: 20, trackedSets: [trackedSet()] }],
    })).not.toThrow();
    expect(() => WorkoutSession.create({ ...session(), workout: [{ ...assignedExercise(), exerciseToSplitId: 0 }] })).toThrow(
      'Exercise-to-split ID must be a positive integer',
    );
  });

  it('requires valid ordered workout timestamps', () => {
    expect(() => WorkoutSession.create({ ...session(), workoutStartUtc: 'invalid' })).toThrow('Workout start must be a valid ISO datetime');
    expect(() => WorkoutSession.create({ ...session(), workoutEndUtc: '2026-09-25T09:59:59Z' })).toThrow(
      'Workout end must not be earlier than workout start',
    );
  });
});
