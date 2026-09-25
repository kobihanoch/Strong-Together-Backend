import { LocalStartTime } from '../value-objects/local-start-time';
import { Weekday } from '../value-objects/weekday';
import { WorkoutSplitId } from '../value-objects/workout-split-id';

/** Primitive values used to construct a workout schedule entry. */
export interface WorkoutScheduleEntryValues {
  workoutSplitId: number;
  dayOfWeek: number;
  startTime: string;
}

/** One workout split assigned to a weekday and local start time. */
export class WorkoutScheduleEntry {
  public readonly workoutSplitId: WorkoutSplitId;
  public readonly dayOfWeek: Weekday;
  public readonly startTime: LocalStartTime;

  private constructor(values: WorkoutScheduleEntryValues) {
    this.workoutSplitId = WorkoutSplitId.create(values.workoutSplitId);
    this.dayOfWeek = Weekday.create(values.dayOfWeek);
    this.startTime = LocalStartTime.create(values.startTime);
  }

  /** Creates a validated weekly schedule entry. */
  public static create(values: WorkoutScheduleEntryValues): WorkoutScheduleEntry {
    return new WorkoutScheduleEntry(values);
  }
}
