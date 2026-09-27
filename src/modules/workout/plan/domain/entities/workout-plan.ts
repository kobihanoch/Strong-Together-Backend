import {
  DuplicateWorkoutSplitIdError,
  DuplicateWorkoutSplitOrderError,
  TooManyWorkoutSplitsError,
  WorkoutPlanRequiresSplitError,
  WorkoutSplitNotInPlanError,
} from '../errors/workout-plan.errors';
import { WorkoutSplit, type WorkoutSplitValues } from './workout-split';

/** Active workout plan and the splits whose lifecycle it owns. */
export class WorkoutPlan {
  private constructor(
    public readonly id: number | undefined,
    public splits: WorkoutSplit[],
  ) {}

  public static create(submittedSplits: WorkoutSplitValues[]): WorkoutPlan {
    WorkoutPlan.validateSubmittedSplits(submittedSplits);
    return new WorkoutPlan(undefined, submittedSplits.map(WorkoutSplit.create));
  }

  public static restore(id: number, splits: WorkoutSplit[]): WorkoutPlan {
    return new WorkoutPlan(id, splits);
  }

  /** Makes the submitted splits the plan's complete active split list. */
  public replaceSplits(submittedSplits: WorkoutSplitValues[]): void {
    // Step 1: reject an invalid replacement before changing the current plan.
    WorkoutPlan.validateSubmittedSplits(submittedSplits);

    // Step 2: an ID means "update this split", so it must already belong to this plan.
    const persistedSplitsById = this.indexPersistedSplitsById();
    this.ensureSubmittedSplitIdsBelongToPlan(submittedSplits, persistedSplitsById);

    // Step 3: splits omitted from the submission are no longer part of the active plan.
    const submittedSplitIds = new Set(submittedSplits.flatMap((split) => split.id === undefined ? [] : [split.id]));
    const removedSplits = this.splits
      .filter((split) => split.id !== undefined && !submittedSplitIds.has(split.id))
      .map((split) => split.deactivate());

    // Step 4: update submitted splits with IDs and create submitted splits without IDs.
    const activeSplits = submittedSplits.map((submittedSplit) => {
      const persistedSplit = submittedSplit.id === undefined ? undefined : persistedSplitsById.get(submittedSplit.id);
      return persistedSplit ? persistedSplit.replaceWith(submittedSplit) : WorkoutSplit.create(submittedSplit);
    });

    // The repository persists this already-decided active/inactive state atomically.
    this.splits = [...activeSplits, ...removedSplits];
  }

  private indexPersistedSplitsById(): Map<number, WorkoutSplit> {
    return new Map(this.splits.flatMap((split) => split.id === undefined ? [] : [[split.id, split] as const]));
  }

  private ensureSubmittedSplitIdsBelongToPlan(
    submittedSplits: WorkoutSplitValues[],
    persistedSplitsById: Map<number, WorkoutSplit>,
  ): void {
    for (const submittedSplit of submittedSplits) {
      if (submittedSplit.id !== undefined && !persistedSplitsById.has(submittedSplit.id)) {
        throw new WorkoutSplitNotInPlanError(submittedSplit.id);
      }
    }
  }

  private static validateSubmittedSplits(submittedSplits: WorkoutSplitValues[]): void {
    if (submittedSplits.length === 0) throw new WorkoutPlanRequiresSplitError();
    if (submittedSplits.length > 20) throw new TooManyWorkoutSplitsError();

    const submittedIds = new Set<number>();
    const submittedOrderIndexes = new Set<number>();
    for (const submittedSplit of submittedSplits) {
      if (submittedSplit.id !== undefined) {
        if (submittedIds.has(submittedSplit.id)) throw new DuplicateWorkoutSplitIdError();
        submittedIds.add(submittedSplit.id);
      }
      if (submittedOrderIndexes.has(submittedSplit.orderIndex)) throw new DuplicateWorkoutSplitOrderError();
      submittedOrderIndexes.add(submittedSplit.orderIndex);
    }
  }
}
