const ISO_DATETIME_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/** UTC-aware start and optional end timestamps for a completed workout. */
export class WorkoutPeriod {
  public readonly startUtc: string;
  public readonly endUtc: string | null;

  private constructor(startUtc: string, endUtc?: string | null) {
    if (!WorkoutPeriod.isValidTimestamp(startUtc)) throw new InvalidWorkoutStartError();
    if (endUtc !== undefined && endUtc !== null && !WorkoutPeriod.isValidTimestamp(endUtc)) {
      throw new InvalidWorkoutEndError();
    }
    if (endUtc && Date.parse(endUtc) < Date.parse(startUtc)) throw new WorkoutEndBeforeStartError();

    this.startUtc = startUtc;
    this.endUtc = endUtc || null;
  }

  public static create(startUtc: string, endUtc?: string | null): WorkoutPeriod {
    return new WorkoutPeriod(startUtc, endUtc);
  }

  private static isValidTimestamp(value: string): boolean {
    return ISO_DATETIME_WITH_OFFSET.test(value) && Number.isFinite(Date.parse(value));
  }
}
import { InvalidWorkoutEndError, InvalidWorkoutStartError, WorkoutEndBeforeStartError } from '../errors/workout-tracking.errors';
