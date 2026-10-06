import { ScheduledWorkout, type ScheduledWorkoutValues } from './scheduled-workout';
import { DuplicateScheduledWorkoutError, TooManyScheduledWorkoutsError } from '../errors/workout-schedule.errors';

/** Complete weekly schedule submitted as one atomic replacement. */
export class WorkoutSchedule {
  public readonly entries: ScheduledWorkout[];

  private constructor(entries: ScheduledWorkoutValues[]) {
    this.entries = entries.map(ScheduledWorkout.create);
  }

  /** Creates a weekly schedule and prevents duplicate split/day assignments. */
  public static create(entries: ScheduledWorkoutValues[]): WorkoutSchedule {
    if (entries.length > 140) throw new TooManyScheduledWorkoutsError();

    const keys = new Set<string>();
    for (const entry of entries) {
      const key = `${entry.workoutSplitId}:${entry.dayOfWeek}`;
      if (keys.has(key)) throw new DuplicateScheduledWorkoutError();
      keys.add(key);
    }
    return new WorkoutSchedule(entries);
  }
}
