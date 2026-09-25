import { ExerciseReference, type ExerciseReferenceValues } from '../value-objects/exercise-reference';
import { TrackedSet } from '../value-objects/tracked-set';

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

  public constructor(values: TrackedExerciseValues) {
    if (values.trackedSets.length === 0) throw new Error('Each exercise must include at least one tracked set');
    if (values.trackedSets.length > 100) throw new Error('An exercise cannot include more than 100 tracked sets');

    const setIndexes = new Set<number>();
    for (const set of values.trackedSets) {
      if (setIndexes.has(set.setIndex)) throw new Error('Set indexes must be unique');
      setIndexes.add(set.setIndex);
    }

    const notes = values.notes?.trim();
    if (notes !== undefined && notes !== null && notes.length > 2_000) throw new Error('Notes must be at most 2000 characters');

    this.reference = new ExerciseReference(values);
    this.trackedSets = values.trackedSets.map((set) => new TrackedSet(set.reps, set.weight, set.setIndex));
    this.notes = notes;
  }
}
