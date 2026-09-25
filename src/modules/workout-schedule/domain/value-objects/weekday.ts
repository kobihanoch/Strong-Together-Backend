/** Day in a Sunday-through-Saturday weekly schedule. */
export class Weekday {
  private constructor(public readonly value: number) {}

  /** Creates a weekday represented by an integer from zero through six. */
  public static create(value: number): Weekday {
    if (!Number.isInteger(value) || value < 0 || value > 6) throw new Error('Day of week must be an integer between 0 and 6');
    return new Weekday(value);
  }
}
