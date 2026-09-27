/** Valid IANA time-zone identifier used to calculate reminder delivery. */
export class ReminderTimeZone {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0 || normalized.length > 100 || !ReminderTimeZone.isSupported(normalized)) {
      throw new Error('Time zone must be a valid IANA time zone');
    }
    this.value = normalized;
  }

  private static isSupported(value: string): boolean {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
      return true;
    } catch {
      return false;
    }
  }
}
