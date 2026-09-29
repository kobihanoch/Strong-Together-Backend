import { describe, expect, it } from 'vitest';
import { WorkoutSchedule } from './workout-schedule';

const entry = { workoutSplitId: 4, dayOfWeek: 1, startTime: '08:30' };

describe('WorkoutSchedule', () => {
  it('supports clearing the complete schedule', () => {
    expect(WorkoutSchedule.create([]).entries).toEqual([]);
  });

  it('creates validated schedule value objects', () => {
    const schedule = WorkoutSchedule.create([entry]);

    expect(schedule.entries[0]?.workoutSplitId.value).toBe(4);
    expect(schedule.entries[0]?.dayOfWeek.value).toBe(1);
    expect(schedule.entries[0]?.startTime.value).toBe('08:30');
  });

  it('allows the same split on different weekdays and rejects duplicate split/day pairs', () => {
    expect(() => WorkoutSchedule.create([entry, { ...entry, dayOfWeek: 2 }])).not.toThrow();
    expect(() => WorkoutSchedule.create([entry, { ...entry, startTime: '09:00' }])).toThrow('A workout split can only be scheduled once per weekday');
  });

  it('enforces split identity, weekday, time, and weekly size limits', () => {
    expect(() => WorkoutSchedule.create([{ ...entry, workoutSplitId: 0 }])).toThrow('Workout split ID must be a positive integer');
    expect(() => WorkoutSchedule.create([{ ...entry, dayOfWeek: 7 }])).toThrow('Day of week must be an integer between 0 and 6');
    expect(() => WorkoutSchedule.create([{ ...entry, startTime: '24:00' }])).toThrow('Start time must use 24-hour HH:mm format');
    expect(() =>
      WorkoutSchedule.create(Array.from({ length: 141 }, (_, index) => ({ workoutSplitId: index + 1, dayOfWeek: 0, startTime: '08:30' }))),
    ).toThrow('A weekly schedule cannot contain more than 140 entries');
  });
});
