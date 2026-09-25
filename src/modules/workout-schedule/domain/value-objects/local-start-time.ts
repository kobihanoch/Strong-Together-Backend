const LOCAL_START_TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

/** Minute-precision local start time for a scheduled workout. */
export class LocalStartTime {
  private constructor(public readonly value: string) {}

  /** Creates a 24-hour local time in HH:mm format. */
  public static create(value: string): LocalStartTime {
    if (!LOCAL_START_TIME_PATTERN.test(value)) throw new Error('Start time must use 24-hour HH:mm format');
    return new LocalStartTime(value);
  }
}
