import { WorkoutScheduleEntry, type WorkoutScheduleEntryValues } from './workout-schedule-entry';

/** Complete weekly schedule submitted as one atomic replacement. */
export class WeeklyWorkoutSchedule {
  public readonly entries: WorkoutScheduleEntry[];

  private constructor(entries: WorkoutScheduleEntryValues[]) {
    this.entries = entries.map(WorkoutScheduleEntry.create);
  }

  /** Creates a weekly schedule and prevents duplicate split/day assignments. */
  public static create(entries: WorkoutScheduleEntryValues[]): WeeklyWorkoutSchedule {
    if (entries.length > 140) throw new Error('A weekly schedule cannot contain more than 140 entries');

    const keys = new Set<string>();
    for (const entry of entries) {
      const key = `${entry.workoutSplitId}:${entry.dayOfWeek}`;
      if (keys.has(key)) throw new Error('A workout split can only be scheduled once per weekday');
      keys.add(key);
    }
    return new WeeklyWorkoutSchedule(entries);
  }
}
