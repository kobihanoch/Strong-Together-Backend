import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { WorkoutPlanStateSqlRow } from '../workout-plan.db-types';

/** Locks and reads the complete workout-plan state required by replacement behavior. */
@Injectable()
export class FindForUpdateSql {
  constructor(private readonly dbService: DBService) {}

  async execute(): Promise<WorkoutPlanStateSqlRow[]> {
    // Lock the active plan first. This serializes replacements for the same user.
    const plans = await this.dbService.sql<Array<{ id: number }>>`
      SELECT id::INT
      FROM workout.workout_plan
      WHERE user_id = identity.current_user_id () AND is_active = TRUE
      FOR UPDATE
    `;
    const plan = plans[0];
    if (!plan) return [];

    // Lock every split, including inactive ones. Inactive owned IDs may be submitted again
    // and reactivated, so they are part of the state needed by the domain.
    await this.dbService.sql`
      SELECT id
      FROM workout.workout_split
      WHERE workout_id = ${plan.id}::BIGINT
      FOR UPDATE
    `;

    // Hydrate splits, assignments, and sets after locking. The flat result avoids SQL
    // lifecycle decisions; the repository maps these persistence rows into entities.
    return this.dbService.sql<WorkoutPlanStateSqlRow[]>`
      SELECT
        plan.id::INT AS "planId",
        split.id::INT AS "splitId",
        split.name,
        split.order_index::INT AS "splitOrderIndex",
        split.is_active AS "splitIsActive",
        assignment.exercise_id::INT AS "exerciseId",
        assignment.order_index::INT AS "exerciseOrderIndex",
        assignment.is_active AS "exerciseIsActive",
        COALESCE(
          ARRAY_AGG(workout_set.reps ORDER BY workout_set.order_index) FILTER (WHERE workout_set.id IS NOT NULL),
          ARRAY[]::INT[]
        ) AS sets
      FROM workout.workout_plan plan
      LEFT JOIN workout.workout_split split ON split.workout_id = plan.id
      LEFT JOIN workout.exercise_to_workout_split assignment ON assignment.workout_split_id = split.id
      LEFT JOIN workout.workout_set ON workout_set.exercise_to_split_id = assignment.id
      WHERE plan.id = ${plan.id}::BIGINT
      GROUP BY plan.id, split.id, assignment.id
      ORDER BY split.id, assignment.order_index, assignment.exercise_id
    `;
  }
}
