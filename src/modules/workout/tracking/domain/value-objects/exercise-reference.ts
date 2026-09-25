/** Primitive exercise-reference values accepted from the application boundary. */
export type ExerciseReferenceValues =
  | { isExerciseAssignedToSplit: true; exerciseToSplitId: number; exerciseId?: number | null | undefined }
  | { isExerciseAssignedToSplit: false; exerciseToSplitId?: null | undefined; exerciseId: number };

/** Identifies either a planned exercise assignment or an unassigned exercise. */
export class ExerciseReference {
  public readonly isExerciseAssignedToSplit: boolean;
  public readonly exerciseToSplitId: number | null;
  public readonly exerciseId: number | null;

  public constructor(values: ExerciseReferenceValues) {
    if (values.isExerciseAssignedToSplit) {
      if (!Number.isInteger(values.exerciseToSplitId) || values.exerciseToSplitId <= 0) {
        throw new Error('Exercise-to-split ID must be a positive integer');
      }
      if (values.exerciseId !== undefined && values.exerciseId !== null && (!Number.isInteger(values.exerciseId) || values.exerciseId <= 0)) {
        throw new Error('Exercise ID must be a positive integer');
      }
      this.exerciseToSplitId = values.exerciseToSplitId;
      this.exerciseId = values.exerciseId ?? null;
    } else {
      if (!Number.isInteger(values.exerciseId) || values.exerciseId <= 0) throw new Error('Exercise ID must be a positive integer');
      this.exerciseToSplitId = null;
      this.exerciseId = values.exerciseId;
    }
    this.isExerciseAssignedToSplit = values.isExerciseAssignedToSplit;
  }
}
