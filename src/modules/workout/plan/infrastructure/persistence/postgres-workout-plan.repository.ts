import { Injectable } from '@nestjs/common';
import { WorkoutPlanRepository } from '../../application/ports/workout-plan.repository';
import { WorkoutPlan } from '../../domain/entities/workout-plan';
import { WorkoutSplit } from '../../domain/entities/workout-split';
import { FindForUpdateSql } from './reads/find-for-update.sql';
import { SavePlanSql } from './writes/save-plan.sql';
import { SavePlannedExercisesSql } from './writes/save-planned-exercises.sql';
import { SaveSplitsSql } from './writes/save-splits.sql';
/** PostgreSQL adapter for active workout plans. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutPlanRepository implements WorkoutPlanRepository {
  public constructor(
    private readonly findForUpdateSql: FindForUpdateSql,
    private readonly savePlanSql: SavePlanSql,
    private readonly saveSplitsSql: SaveSplitsSql,
    private readonly savePlannedExercisesSql: SavePlannedExercisesSql,
  ) {}

  async findForUpdate(userId: string): Promise<WorkoutPlan | undefined> {
    const rows = await this.findForUpdateSql.execute(userId);
    const first = rows[0];
    if (!first) return undefined;

    // The SQL result has one row per exercise assignment. Group those rows back
    // into one collection per split before restoring domain entities.
    const splitRows = new Map<number, typeof rows>();
    for (const row of rows) {
      if (row.splitId === null) continue;
      const current = splitRows.get(row.splitId) ?? [];
      current.push(row);
      splitRows.set(row.splitId, current);
    }
    const splits = [...splitRows.values()].map((rowsForSplit) => {
      const persistedSplit = rowsForSplit[0];
      if (
        !persistedSplit
        || persistedSplit.splitId === null
        || persistedSplit.name === null
        || persistedSplit.splitOrderIndex === null
        || persistedSplit.splitIsActive === null
      ) {
        throw new Error('Workout split persistence state is incomplete');
      }

      // Active splits are compared only with their active assignments. For an inactive
      // split, retain its prior assignments so reactivation can detect the resulting change.
      return WorkoutSplit.restore({
        id: persistedSplit.splitId,
        name: persistedSplit.name,
        orderIndex: persistedSplit.splitOrderIndex,
        exercises: rowsForSplit.flatMap((assignment) => assignment.exerciseId === null
          || assignment.exerciseOrderIndex === null
          || (persistedSplit.splitIsActive && !assignment.exerciseIsActive) ? [] : [{
          exerciseId: assignment.exerciseId,
          orderIndex: assignment.exerciseOrderIndex,
          sets: assignment.sets,
        }]),
      }, persistedSplit.splitIsActive);
    });
    return WorkoutPlan.restore(first.planId, splits);
  }

  async save(userId: string, plan: WorkoutPlan): Promise<void> {
    // Convert domain values to primitives only at the persistence boundary.
    // SQL receives the active/inactive and changed/unchanged decisions; it does not make them.
    const splits = plan.splits.map((split) => ({
      id: split.id,
      name: split.name.value,
      orderIndex: split.orderIndex.value,
      exercises: split.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map((set) => set.value),
        orderIndex: exercise.orderIndex.value,
      })),
      isActive: split.isActive,
      hasChanges: split.hasChanges,
    }));
    const planId = await this.savePlanSql.execute(userId, plan.id);
    const persistedSplits = await this.saveSplitsSql.execute(planId, splits);
    await this.savePlannedExercisesSql.execute(planId, persistedSplits);
  }
}
