/** Identity of a workout split referenced by a schedule entry. */
export class WorkoutSplitId {
  private constructor(public readonly value: number) {}

  /** Creates a positive workout-split identifier. */
  public static create(value: number): WorkoutSplitId {
    if (!Number.isInteger(value) || value <= 0) throw new Error('Workout split ID must be a positive integer');
    return new WorkoutSplitId(value);
  }
}
