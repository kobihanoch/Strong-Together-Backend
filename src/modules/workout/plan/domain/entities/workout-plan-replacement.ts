import { WorkoutSplit, type WorkoutSplitValues } from './workout-split';

/** Complete workout plan submitted as one atomic replacement. */
export class WorkoutPlanReplacement {
  public readonly splits: WorkoutSplit[];

  private constructor(splits: WorkoutSplitValues[]) {
    this.splits = splits.map(WorkoutSplit.create);
  }

  /** Creates a complete plan and enforces plan-level size and uniqueness rules. */
  public static create(splits: WorkoutSplitValues[]): WorkoutPlanReplacement {
    if (splits.length === 0) throw new Error('Workout must include at least one split');
    if (splits.length > 20) throw new Error('A workout cannot include more than 20 splits');

    const ids = new Set<number>();
    const orderIndexes = new Set<number>();
    for (const split of splits) {
      if (split.id !== undefined) {
        if (ids.has(split.id)) throw new Error('Workout split IDs must be unique');
        ids.add(split.id);
      }
      if (orderIndexes.has(split.orderIndex)) throw new Error('Workout split order indexes must be unique');
      orderIndexes.add(split.orderIndex);
    }
    return new WorkoutPlanReplacement(splits);
  }
}
