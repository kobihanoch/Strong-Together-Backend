import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { WorkoutExerciseInput, WorkoutSplitInput } from '../application/models/workout-plan.models';
import type {
  ExerciseAssignmentIdSqlRow,
  ExistingExercisesSqlRow,
  WorkoutPlanIdSqlRow,
  WorkoutPlanSqlRow,
  WorkoutSplitIdSqlRow,
} from './workout-plan.db-types';

type ExistingWorkoutSplitInput = WorkoutSplitInput & { id: number };

@Injectable()
export class WorkoutPlanSql {
  constructor(private readonly dbService: DBService) {}

  // Return the complete active plan in the same shape used by clients for display and editing.
  /**
   * Whole user workout plan.
   * @param userId - The user identifier.
   * @param tz - The IANA time-zone name.
   * @returns The whole user workout plan result.
   */
  async queryWholeUserWorkoutPlan(userId: string, tz: string): Promise<WorkoutPlanSqlRow[]> {
    return this.dbService.sql<WorkoutPlanSqlRow[]>`
      WITH
        ranked_workout_durations AS (
          SELECT
            summaries.workout_split_id,
            EXTRACT(
              EPOCH
              FROM
                (summaries.workout_end_utc - summaries.workout_start_utc)
            ) / 60 AS duration_minutes,
            ROW_NUMBER() OVER (
              PARTITION BY
                summaries.workout_split_id
              ORDER BY
                summaries.workout_start_utc DESC
            ) AS recency_rank
          FROM
            tracking.workout_summary summaries
            JOIN workout.workout_split duration_split ON duration_split.id = summaries.workout_split_id
          WHERE
            summaries.user_id = ${userId}::UUID
            AND summaries.workout_start_utc >= duration_split.updated_at
            AND summaries.workout_end_utc > summaries.workout_start_utc
            AND summaries.workout_end_utc - summaries.workout_start_utc <= INTERVAL '4 hours'
        ),
        split_duration_estimates AS (
          SELECT
            durations.workout_split_id,
            ROUND(
              PERCENTILE_CONT(0.5) WITHIN GROUP (
                ORDER BY
                  durations.duration_minutes
              )
            )::INT AS estimated_duration_minutes
          FROM
            ranked_workout_durations durations
          WHERE
            durations.recency_rank <= 10
          GROUP BY
            durations.workout_split_id
        )
      SELECT
        workoutplans.id::INT,
        workout.get_number_of_splits (workoutplans.id)::INT AS "numberOfSplits",
        workoutplans.created_at AS "createdAt",
        workoutplans.user_id AS "userId",
        workoutplans.is_active AS "isActive",
        (
          workoutplans.updated_at AT TIME ZONE ${tz}
        ) AS "updatedAt",
        (
          SELECT
            COALESCE(
              JSON_AGG(
                JSONB_BUILD_OBJECT(
                  'id',
                  workoutsplits.id,
                  'workoutId',
                  workoutsplits.workout_id,
                  'name',
                  workoutsplits.name,
                  'orderIndex',
                  workoutsplits.order_index,
                  'createdAt',
                  workoutsplits.created_at,
                  'isActive',
                  workoutsplits.is_active,
                  'muscleGroup',
                  workout.get_muscle_group (workoutsplits.id),
                  'estimatedDurationMinutes',
                  duration_estimates.estimated_duration_minutes,
                  'exercises',
                  (
                    SELECT
                      COALESCE(
                        JSON_AGG(
                          JSONB_BUILD_OBJECT(
                            'exerciseToSplitId',
                            ews.id,
                            'exerciseId',
                            ews.exercise_id,
                            'name',
                            ews.exercise,
                            'sets',
                            ews.sets,
                            'orderIndex',
                            ews.order_index,
                            'isActive',
                            ews.is_active,
                            'targetMuscle',
                            ex.target_muscle,
                            'specificTargetMuscle',
                            ex.specific_target_muscle
                          )
                          ORDER BY
                            ews.order_index
                        ),
                        '[]'::JSON
                      )
                    FROM
                      (
                        SELECT
                          expanded.id,
                          expanded.workout_split_id,
                          expanded.exercise_id,
                          expanded.exercise,
                          expanded.order_index,
                          expanded.is_active,
                          COALESCE(
                            JSONB_AGG(
                              JSONB_BUILD_OBJECT('orderIndex', expanded.set_index, 'reps', expanded.reps)
                              ORDER BY
                                expanded.set_index
                            ) FILTER (
                              WHERE
                                expanded.reps IS NOT NULL
                            ),
                            '[]'::JSONB
                          ) AS sets
                        FROM
                          workout.v_exercise_to_workout_split_set_expanded AS expanded
                        WHERE
                          expanded.is_active = TRUE
                        GROUP BY
                          expanded.id,
                          expanded.workout_split_id,
                          expanded.exercise_id,
                          expanded.exercise,
                          expanded.order_index,
                          expanded.is_active
                      ) AS ews
                      LEFT JOIN workout.exercise ex ON ex.id = ews.exercise_id
                    WHERE
                      ews.workout_split_id = workoutsplits.id
                  )
                )
                ORDER BY
                  workoutsplits.order_index
              ),
              '[]'::JSON
            )
          FROM
            workout.workout_split AS workoutsplits
            LEFT JOIN split_duration_estimates duration_estimates ON duration_estimates.workout_split_id = workoutsplits.id
          WHERE
            workoutsplits.workout_id = workoutplans.id
            AND workoutsplits.is_active = TRUE
        ) AS "workoutSplits"
      FROM
        workout.workout_plan AS workoutplans
      WHERE
        workoutplans.user_id = ${userId}::UUID
        AND workoutplans.is_active = TRUE
      LIMIT
        1;
    `;
  }

  // Save a complete plan snapshot: IDs update existing splits, while missing IDs create new splits.
  /**
   * Adds workout.
   * @param userId - The user identifier.
   * @param workoutData - The workout plan payload.
   * @returns The add workout result.
   */
  async queryAddWorkout(userId: string, workoutData: WorkoutSplitInput[]): Promise<number | { invalidSplitId: number }> {
    const submittedExistingIds = workoutData.flatMap((split) => (split.id === undefined ? [] : [split.id]));

    if (submittedExistingIds.length > 0) {
      const ownedSplits = await this.dbService.sql<WorkoutSplitIdSqlRow[]>`
        SELECT
          split.id::INT
        FROM
          workout.workout_split split
          JOIN workout.workout_plan plan ON plan.id = split.workout_id
        WHERE
          split.id = ANY (${submittedExistingIds}::BIGINT[])
          AND plan.user_id = ${userId}::UUID
          AND plan.is_active = TRUE
        FOR UPDATE OF
          split,
          plan
      `;
      const ownedSplitIds = new Set(ownedSplits.map(({ id }) => id));
      const invalidSplitId = submittedExistingIds.find((id) => !ownedSplitIds.has(id));
      if (invalidSplitId !== undefined) return { invalidSplitId };
    }

    const [plan] = await this.dbService.sql<WorkoutPlanIdSqlRow[]>`
      INSERT INTO
        workout.workout_plan (user_id, is_active, updated_at)
      VALUES
        (${userId}::UUID, TRUE, NOW())
      ON CONFLICT (user_id)
      WHERE
        is_active DO UPDATE
      SET
        updated_at = NOW()
      RETURNING
        id;
    `;

    await this.dbService.sql`
      UPDATE workout.workout_split
      SET
        is_active = FALSE,
        updated_at = NOW()
      WHERE
        workout_id = ${plan.id}
        AND is_active = TRUE
        AND NOT (id = ANY (${submittedExistingIds}::BIGINT[]));
    `;

    if (submittedExistingIds.length > 0) {
      // Free the active order indexes first, so simple swaps such as 0 <-> 1
      // cannot collide with the active-plan unique index during row updates.
      await this.dbService.sql`
        UPDATE workout.workout_split
        SET
          order_index = - order_index - 1
        WHERE
          workout_id = ${plan.id}
          AND is_active = TRUE
          AND id = ANY (${submittedExistingIds}::BIGINT[]);
      `;
    }

    const savedSplits = [];
    for (const split of workoutData) {
      const id =
        split.id !== undefined ? await this.updateWorkoutSplit(plan.id, { ...split, id: split.id }) : await this.insertWorkoutSplit(plan.id, split);
      savedSplits.push({ id, exercises: split.exercises });
    }

    await this.replaceWorkoutExercises(plan.id, savedSplits);
    return plan.id;
  }

  /**
   * Inserts a workout split and returns its identifier.
   * @param planId - The workout plan identifier.
   * @param split - The workout split to persist.
   * @returns The insert workout split result.
   */
  private async insertWorkoutSplit(planId: number, split: WorkoutSplitInput): Promise<number> {
    // A split without an ID is new and receives a stable database identity.
    const [{ id }] = await this.dbService.sql<WorkoutSplitIdSqlRow[]>`
      INSERT INTO
        workout.workout_split (workout_id, name, order_index, is_active)
      VALUES
        (
          ${planId},
          ${split.name},
          ${split.orderIndex},
          TRUE
        )
      RETURNING
        id;
    `;
    return id;
  }

  /**
   * Updates a workout split and returns its identifier.
   * @param planId - The workout plan identifier.
   * @param split - The workout split to persist.
   * @returns The update workout split result.
   */
  private async updateWorkoutSplit(planId: number, split: ExistingWorkoutSplitInput): Promise<number> {
    // Preserve the split identity when it is renamed, reordered, or reactivated.
    const [updated] = await this.dbService.sql<WorkoutSplitIdSqlRow[]>`
      UPDATE workout.workout_split
      SET
        name = ${split.name},
        order_index = ${split.orderIndex},
        is_active = TRUE,
        updated_at = CASE
          WHEN name IS DISTINCT FROM ${split.name}
          OR order_index IS DISTINCT FROM ${split.orderIndex}
          OR is_active IS DISTINCT FROM TRUE THEN NOW()
          ELSE updated_at
        END
      WHERE
        id = ${split.id}::int8
        AND workout_id = ${planId}::int8
      RETURNING
        id;
    `;

    if (!updated) throw new Error(`Locked workout split ${split.id} could not be updated`);
    return updated.id;
  }

  /**
   * Replaces the exercises and sets assigned to workout splits.
   * @param planId - The workout plan identifier.
   * @param splits - The workout splits to process.
   */
  private async replaceWorkoutExercises(planId: number, splits: Array<{ id: number; exercises: WorkoutExerciseInput[] }>): Promise<void> {
    const changedSplitIds: number[] = [];
    for (const split of splits) {
      const [{ exercises }] = await this.dbService.sql<ExistingExercisesSqlRow[]>`
        SELECT
          COALESCE(
            JSONB_AGG(
              JSONB_BUILD_OBJECT(
                'exerciseId',
                assignment.exercise_id::INT,
                'orderIndex',
                assignment.order_index::INT,
                'sets',
                (
                  SELECT
                    COALESCE(
                      JSONB_AGG(
                        workout_set.reps
                        ORDER BY
                          workout_set.order_index
                      ),
                      '[]'::JSONB
                    )
                  FROM
                    workout.workout_set
                  WHERE
                    workout_set.exercise_to_split_id = assignment.id
                )
              )
              ORDER BY
                assignment.order_index,
                assignment.exercise_id
            ) FILTER (
              WHERE
                assignment.id IS NOT NULL
            ),
            '[]'::JSONB
          ) AS exercises
        FROM
          workout.exercise_to_workout_split assignment
        WHERE
          assignment.workout_split_id = ${split.id}
          AND assignment.is_active = TRUE
      `;

      const normalizeExercises = (items: WorkoutExerciseInput[]) =>
        items
          .map((exercise) => ({
            exerciseId: Number(exercise.exerciseId),
            orderIndex: Number(exercise.orderIndex),
            sets: exercise.sets.map(Number),
          }))
          .sort((left, right) => left.orderIndex - right.orderIndex || left.exerciseId - right.exerciseId);

      if (JSON.stringify(normalizeExercises(exercises)) !== JSON.stringify(normalizeExercises(split.exercises))) {
        changedSplitIds.push(split.id);
      }
    }

    // Deactivate previous assignments; submitted exercises are reactivated below.
    await this.dbService.sql`
      UPDATE workout.exercise_to_workout_split
      SET
        is_active = FALSE
      WHERE
        workout_split_id IN (
          SELECT
            id
          FROM
            workout.workout_split
          WHERE
            workout_id = ${planId}
        );
    `;

    for (const split of splits) {
      for (const exercise of split.exercises) {
        // Create this assignment or reactivate it with its latest exercise order.
        const [savedExercise] = await this.dbService.sql<ExerciseAssignmentIdSqlRow[]>`
          INSERT INTO
            workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
          VALUES
            (
              ${split.id},
              ${exercise.exerciseId},
              ${exercise.orderIndex},
              TRUE
            )
          ON CONFLICT (workout_split_id, exercise_id) DO UPDATE
          SET
            order_index = EXCLUDED.order_index,
            is_active = TRUE
          RETURNING
            id;
        `;

        // Replace planned sets so the submitted payload remains the source of truth.
        await this.dbService.sql`
          DELETE FROM workout.workout_set
          WHERE
            exercise_to_split_id = ${savedExercise.id};
        `;

        for (const [setIndex, reps] of exercise.sets.entries()) {
          await this.dbService.sql`
            INSERT INTO
              workout.workout_set (exercise_to_split_id, order_index, reps)
            VALUES
              (
                ${savedExercise.id},
                ${setIndex},
                ${reps}
              );
          `;
        }
      }
    }

    if (changedSplitIds.length > 0) {
      await this.dbService.sql`
        UPDATE workout.workout_split
        SET
          updated_at = NOW()
        WHERE
          id = ANY (${changedSplitIds}::BIGINT[])
      `;
    }
  }
}
