const ISO_DATETIME_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/** UTC-aware start and optional end timestamps for a completed workout. */
export class WorkoutPeriod {
  public readonly startUtc: string;
  public readonly endUtc: string | null;

  public constructor(startUtc: string, endUtc?: string | null) {
    if (!WorkoutPeriod.isValidTimestamp(startUtc)) throw new Error('Workout start must be a valid ISO datetime');
    if (endUtc !== undefined && endUtc !== null && !WorkoutPeriod.isValidTimestamp(endUtc)) {
      throw new Error('Workout end must be a valid ISO datetime');
    }
    if (endUtc && Date.parse(endUtc) < Date.parse(startUtc)) throw new Error('Workout end must not be earlier than workout start');

    this.startUtc = startUtc;
    this.endUtc = endUtc || null;
  }

  private static isValidTimestamp(value: string): boolean {
    return ISO_DATETIME_WITH_OFFSET.test(value) && Number.isFinite(Date.parse(value));
  }
}
