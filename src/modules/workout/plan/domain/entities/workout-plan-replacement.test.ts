import { describe, expect, it } from 'vitest';
import { WorkoutPlanReplacement } from './workout-plan-replacement';

const exercise = (exerciseId = 1, orderIndex = 0) => ({ exerciseId, orderIndex, sets: [8, 10] });
const split = (orderIndex = 0) => ({ name: ' Push ', orderIndex, exercises: [exercise()] });

describe('WorkoutPlanReplacement', () => {
  it('creates a plan with normalized value objects', () => {
    const plan = WorkoutPlanReplacement.create([split()]);

    expect(plan.splits[0]?.name.value).toBe('Push');
    expect(plan.splits[0]?.exercises[0]?.sets.map(({ value }) => value)).toEqual([8, 10]);
  });

  it('requires one to twenty splits with unique order indexes', () => {
    expect(() => WorkoutPlanReplacement.create([])).toThrow('Workout must include at least one split');
    expect(() => WorkoutPlanReplacement.create([split(), split()])).toThrow('Workout split order indexes must be unique');
    expect(() => WorkoutPlanReplacement.create(Array.from({ length: 21 }, (_, index) => split(index)))).toThrow(
      'A workout cannot include more than 20 splits',
    );
  });

  it('requires unique existing split identities', () => {
    expect(() => WorkoutPlanReplacement.create([{ ...split(0), id: 7 }, { ...split(1), id: 7 }])).toThrow(
      'Workout split IDs must be unique',
    );
  });

  it('enforces unique exercises and exercise order indexes within a split', () => {
    expect(() => WorkoutPlanReplacement.create([{ ...split(), exercises: [exercise(1, 0), exercise(1, 1)] }])).toThrow(
      'Exercise IDs must be unique within a split',
    );
    expect(() => WorkoutPlanReplacement.create([{ ...split(), exercises: [exercise(1, 0), exercise(2, 0)] }])).toThrow(
      'Exercise order indexes must be unique within a split',
    );
  });

  it('enforces split, exercise, set, and ordering value ranges', () => {
    expect(() => WorkoutPlanReplacement.create([{ ...split(), name: ' ' }])).toThrow('Split name is required');
    expect(() => WorkoutPlanReplacement.create([{ ...split(), orderIndex: -1 }])).toThrow('Order index must be a non-negative integer');
    expect(() => WorkoutPlanReplacement.create([{ ...split(), exercises: [] }])).toThrow('Each split must include at least one exercise');
    expect(() => WorkoutPlanReplacement.create([{ ...split(), exercises: [{ ...exercise(), sets: [] }] }])).toThrow(
      'Each exercise must include at least one set',
    );
    expect(() => WorkoutPlanReplacement.create([{ ...split(), exercises: [{ ...exercise(), sets: [0] }] }])).toThrow(
      'Repetitions must be an integer between 1 and 10000',
    );
  });
});
