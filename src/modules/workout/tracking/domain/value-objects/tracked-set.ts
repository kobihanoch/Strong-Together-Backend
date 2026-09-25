/** One performed set recorded during a workout. */
export class TrackedSet {
  public readonly reps: number;
  public readonly weight: number;
  public readonly setIndex: number;

  public constructor(reps: number, weight: number, setIndex: number) {
    if (!Number.isInteger(reps) || reps < 1 || reps > 10_000) throw new Error('Reps must be an integer between 1 and 10000');
    if (!Number.isFinite(weight) || weight < 0 || weight > 100_000) throw new Error('Weight must be between 0 and 100000');
    if (!Number.isInteger(setIndex) || setIndex < 0) throw new Error('Set index must be a non-negative integer');

    this.reps = reps;
    this.weight = weight;
    this.setIndex = setIndex;
  }
}
