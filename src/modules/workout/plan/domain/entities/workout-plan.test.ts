import { describe, expect, it } from 'vitest';
import { WorkoutPlan } from './workout-plan';
import { WorkoutSplit } from './workout-split';

const exercise = (exerciseId = 1, orderIndex = 0) => ({ exerciseId, orderIndex, sets: [8, 10] });
const split = (orderIndex = 0) => ({ name: ' Push ', orderIndex, exercises: [exercise()] });

describe('WorkoutPlan', () => {
  it('creates a plan with normalized value objects', () => {
    const plan = WorkoutPlan.create([split()]);
    expect(plan.splits[0]?.name.value).toBe('Push');
    expect(plan.splits[0]?.exercises[0]?.sets.map(({ value }) => value)).toEqual([8, 10]);
  });

  it('requires one to twenty splits with unique identities and order indexes', () => {
    expect(() => WorkoutPlan.create([])).toThrow('Workout must include at least one split');
    expect(() => WorkoutPlan.create([split(), split()])).toThrow('Workout split order indexes must be unique');
    expect(() => WorkoutPlan.create(Array.from({ length: 21 }, (_, index) => split(index)))).toThrow('A workout cannot include more than 20 splits');
    expect(() => WorkoutPlan.create([{ ...split(0), id: 7 }, { ...split(1), id: 7 }])).toThrow('Workout split IDs must be unique');
  });

  it('replaces owned splits and deactivates omitted splits', () => {
    const plan = WorkoutPlan.restore(1, [
      WorkoutSplit.restore({ ...split(0), id: 7 }, true),
      WorkoutSplit.restore({ ...split(1), id: 8 }, true),
    ]);
    plan.replaceSplits([{ ...split(0), id: 8, name: 'Pull' }]);
    expect(plan.splits).toMatchObject([{ id: 8, isActive: true, hasChanges: true }, { id: 7, isActive: false, hasChanges: true }]);
  });

  it('rejects a split identity not owned by the restored plan', () => {
    const plan = WorkoutPlan.restore(1, [WorkoutSplit.restore({ ...split(), id: 7 }, true)]);
    expect(() => plan.replaceSplits([{ ...split(), id: 8 }])).toThrow('Workout split does not belong to the active workout plan');
  });

  it('marks an unchanged submitted split as unchanged', () => {
    const persistedSplit = WorkoutSplit.restore({ ...split(), id: 7 }, true);
    const submittedSplit = persistedSplit.replaceWith({ ...split(), id: 7 });

    expect(submittedSplit.hasChanges).toBe(false);
  });

  it('uses exercise order indexes rather than request array position when detecting changes', () => {
    const exercises = [exercise(1, 0), exercise(2, 1)];
    const persistedSplit = WorkoutSplit.restore({ ...split(), id: 7, exercises }, true);
    const submittedSplit = persistedSplit.replaceWith({ ...split(), id: 7, exercises: [...exercises].reverse() });

    expect(submittedSplit.hasChanges).toBe(false);
  });

  it('marks changed details and reactivation as changes', () => {
    const activeSplit = WorkoutSplit.restore({ ...split(), id: 7 }, true);
    const inactiveSplit = WorkoutSplit.restore({ ...split(), id: 8 }, false);

    expect(activeSplit.replaceWith({ ...split(), id: 7, name: 'Pull' }).hasChanges).toBe(true);
    expect(inactiveSplit.replaceWith({ ...split(), id: 8 }).hasChanges).toBe(true);
  });

  it('enforces exercise, set, and ordering rules', () => {
    expect(() => WorkoutPlan.create([{ ...split(), exercises: [exercise(1, 0), exercise(1, 1)] }])).toThrow('Exercise IDs must be unique within a split');
    expect(() => WorkoutPlan.create([{ ...split(), exercises: [exercise(1, 0), exercise(2, 0)] }])).toThrow('Exercise order indexes must be unique within a split');
    expect(() => WorkoutPlan.create([{ ...split(), name: ' ' }])).toThrow('Split name is required');
    expect(() => WorkoutPlan.create([{ ...split(), orderIndex: -1 }])).toThrow('Order index must be a non-negative integer');
    expect(() => WorkoutPlan.create([{ ...split(), exercises: [] }])).toThrow('Each split must include at least one exercise');
    expect(() => WorkoutPlan.create([{ ...split(), exercises: [{ ...exercise(), sets: [] }] }])).toThrow('Each exercise must include at least one set');
    expect(() => WorkoutPlan.create([{ ...split(), exercises: [{ ...exercise(), sets: [0] }] }])).toThrow('Repetitions must be an integer between 1 and 10000');
  });
});
