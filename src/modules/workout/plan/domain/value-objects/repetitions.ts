/** Repetition count prescribed for one workout set. */
export class Repetitions {
  private constructor(public readonly value: number) {}

  /** Creates a repetition count in the supported range. */
  public static create(value: number): Repetitions {
    if (!Number.isInteger(value) || value < 1 || value > 10_000) throw new Error('Repetitions must be an integer between 1 and 10000');
    return new Repetitions(value);
  }
}
