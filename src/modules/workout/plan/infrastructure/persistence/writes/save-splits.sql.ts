import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { PersistedWorkoutSplitSqlInput, SavedWorkoutSplitSqlRow, WorkoutSplitSqlInput } from '../workout-plan.db-types';

/** Persists the split lifecycle already decided by the WorkoutPlan aggregate. */
@Injectable()
export class SaveSplitsSql {
  constructor(private readonly dbService: DBService) {}

  async execute(planId: number, splits: WorkoutSplitSqlInput[]): Promise<PersistedWorkoutSplitSqlInput[]> {
    const activeSplits = splits.filter((split) => split.isActive);
    const removedIds = splits.flatMap((split) => (!split.isActive && split.id !== undefined ? [split.id] : []));
    const existing = activeSplits.filter((split): split is WorkoutSplitSqlInput & { id: number } => split.id !== undefined);
    const newSplits = activeSplits.filter((split) => split.id === undefined);

    // Step 1: deactivate persisted splits omitted from the new active plan.
    if (removedIds.length > 0) {
      await this.dbService.sql`
        UPDATE workout.workout_split
        SET
          is_active = FALSE,
          updated_at = NOW()
        WHERE
          workout_id = ${planId}::BIGINT
          AND id = ANY (${removedIds}::BIGINT[])
          AND is_active = TRUE
      `;
    }

    // Step 2: update and reactivate submitted splits that already have IDs.
    if (existing.length > 0) {
      // 2a: temporarily free their order indexes so swaps such as 0 <-> 1 are valid.
      await this.dbService.sql`
        UPDATE workout.workout_split
        SET
          order_index = - order_index - 1
        WHERE
          workout_id = ${planId}::BIGINT
          AND id = ANY (${existing.map((split) => split.id)}::BIGINT[])
          AND is_active = TRUE
      `;

      // 2b: save the final name, order and active state in one bulk update.
      await this.dbService.sql`
        UPDATE workout.workout_split AS split
        SET
          name = input.name,
          order_index = input.order_index,
          is_active = TRUE,
          updated_at = CASE
            WHEN split.id = ANY (${existing.filter((split) => split.hasChanges).map((split) => split.id)}::BIGINT[]) THEN NOW()
            ELSE split.updated_at
          END
        FROM
          UNNEST(
            ${existing.map((split) => split.id)}::BIGINT[],
            ${existing.map((split) => split.name)}::TEXT[],
            ${existing.map((split) => split.orderIndex)}::INT[]
          ) AS input (id, name, order_index)
        WHERE
          split.id = input.id
          AND split.workout_id = ${planId}::BIGINT
      `;
    }

    // Step 3: insert all submitted splits that do not have IDs yet.
    let created: SavedWorkoutSplitSqlRow[] = [];
    if (newSplits.length > 0) {
      created = await this.dbService.sql<SavedWorkoutSplitSqlRow[]>`
        INSERT INTO
          workout.workout_split (workout_id, name, order_index, is_active)
        SELECT
          ${planId}::BIGINT,
          input.name,
          input.order_index,
          TRUE
        FROM
          UNNEST(
            ${newSplits.map((split) => split.name)}::TEXT[],
            ${newSplits.map((split) => split.orderIndex)}::INT[]
          ) AS input (name, order_index)
        RETURNING
          id::INT,
          order_index::INT AS "orderIndex"
      `;
    }

    // Step 4: attach generated IDs to new splits so exercises can reference them.
    // Order index is safe here because the domain guarantees it is unique within the plan.
    const createdIdsByOrder = new Map(created.map((split) => [split.orderIndex, split.id]));
    return activeSplits.map((split) => {
      const id = split.id ?? createdIdsByOrder.get(split.orderIndex);
      if (id === undefined) throw new Error('A new workout split was not persisted');
      return { ...split, id };
    });
  }
}
