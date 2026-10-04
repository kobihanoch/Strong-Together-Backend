import { ExerciseReference, type ExerciseReferenceValues } from '../value-objects/exercise-reference';
import { TrackedSet } from '../value-objects/tracked-set';
import {
  DuplicateTrackedSetIndexError,
  TooManyTrackedSetsError,
  TrackedExerciseRequiresSetError,
  TrackingNotesTooLongError,
} from '../errors/workout-tracking.errors';

/** Primitive values used to construct a tracked exercise. */
export type TrackedExerciseValues = ExerciseReferenceValues & {
  trackedSets: Array<{ reps: number; weight: number; setIndex: number }>;
  notes?: string | null | undefined;
};

/** Exercise performance recorded as part of a completed workout. */
export class TrackedExercise {
  public readonly reference: ExerciseReference;
  public readonly trackedSets: TrackedSet[];
  public readonly notes: string | null | undefined;

  private constructor(values: TrackedExerciseValues) {
    if (values.trackedSets.length === 0) throw new TrackedExerciseRequiresSetError();
    if (values.trackedSets.length > 100) throw new TooManyTrackedSetsError();

    const setIndexes = new Set<number>();
    for (const set of values.trackedSets) {
      if (setIndexes.has(set.setIndex)) throw new DuplicateTrackedSetIndexError();
      setIndexes.add(set.setIndex);
    }

    const notes = values.notes?.trim();
    if (notes !== undefined && notes !== null && notes.length > 2_000) throw new TrackingNotesTooLongError();

    this.reference = ExerciseReference.create(values);
    this.trackedSets = values.trackedSets.map((set) => TrackedSet.create(set.reps, set.weight, set.setIndex));
    this.notes = notes;
  }

  public static create(values: TrackedExerciseValues): TrackedExercise {
    return new TrackedExercise(values);
  }
}
