/** One performed set recorded during a workout. */
export class TrackedSet {
  public readonly reps: number;
  public readonly weight: number;
  public readonly setIndex: number;

  private constructor(reps: number, weight: number, setIndex: number) {
    if (!Number.isInteger(reps) || reps < 1 || reps > 10_000) throw new InvalidTrackedRepetitionsError();
    if (!Number.isFinite(weight) || weight < 0 || weight > 100_000) throw new InvalidTrackedWeightError();
    if (!Number.isInteger(setIndex) || setIndex < 0) throw new InvalidTrackedSetIndexError();

    this.reps = reps;
    this.weight = weight;
    this.setIndex = setIndex;
  }

  public static create(reps: number, weight: number, setIndex: number): TrackedSet {
    return new TrackedSet(reps, weight, setIndex);
  }
}
import { InvalidTrackedRepetitionsError, InvalidTrackedSetIndexError, InvalidTrackedWeightError } from '../errors/workout-tracking.errors';
