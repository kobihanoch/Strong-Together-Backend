import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import type {
  ExerciseAssignmentIdQueryDto,
  SaveWorkoutSplitInputQueryDto,
  SaveWorkoutSplitPayloadQueryDto,
  WorkoutExerciseInputQueryDto,
  WholeUserWorkoutPlanQueryDto,
  WorkoutPlanIdQueryDto,
  WorkoutSplitIdQueryDto,
} from '@strong-together/shared';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class WorkoutPlanQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  // Return the complete active plan in the same shape used by clients for display and editing.
  async queryWholeUserWorkoutPlan(userId: string, tz: string): Promise<WholeUserWorkoutPlanQueryDto[]> {
    return this.sql<WholeUserWorkoutPlanQueryDto[]>`
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
                              expanded.reps
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
  async queryAddWorkout(userId: string, workoutData: SaveWorkoutSplitPayloadQueryDto): Promise<number> {
    const [plan] = await this.sql<WorkoutPlanIdQueryDto[]>`
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

    await this.sql`
      UPDATE workout.workout_split
      SET
        is_active = FALSE
      WHERE
        workout_id = ${plan.id};
    `;

    const savedSplits = [];
    for (const split of workoutData) {
      const id = split.id !== undefined
        ? await this.updateWorkoutSplit(plan.id, split)
        : await this.insertWorkoutSplit(plan.id, split);
      savedSplits.push({ id, exercises: split.exercises });
    }

    await this.replaceWorkoutExercises(plan.id, savedSplits);
    return plan.id;
  }

  private async insertWorkoutSplit(planId: number, split: SaveWorkoutSplitInputQueryDto): Promise<number> {
    // A split without an ID is new and receives a stable database identity.
    const [{ id }] = await this.sql<WorkoutSplitIdQueryDto[]>`
      INSERT INTO
        workout.workout_split (workout_id, name, order_index, is_active)
      VALUES
        (${planId}, ${split.name}, ${split.orderIndex}, TRUE)
      RETURNING
        id;
    `;
    return id;
  }

  private async updateWorkoutSplit(planId: number, split: SaveWorkoutSplitInputQueryDto): Promise<number> {
    // Preserve the split identity when it is renamed, reordered, or reactivated.
    if (split.id === undefined) {
      throw new BadRequestException('An existing workout split must include an ID');
    }
    const [updated] = await this.sql<WorkoutSplitIdQueryDto[]>`
      UPDATE workout.workout_split
      SET
        name = ${split.name},
        order_index = ${split.orderIndex},
        is_active = TRUE
      WHERE
        id = ${split.id}::int8
        AND workout_id = ${planId}::int8
      RETURNING
        id;
    `;

    if (!updated) {
      throw new BadRequestException(`Workout split ${split.id} does not belong to the active workout plan`);
    }
    return updated.id;
  }

  private async replaceWorkoutExercises(
    planId: number,
    splits: Array<{ id: number; exercises: WorkoutExerciseInputQueryDto[] }>,
  ): Promise<void> {
    // Deactivate previous assignments; submitted exercises are reactivated below.
    await this.sql`
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
        const [savedExercise] = await this.sql<ExerciseAssignmentIdQueryDto[]>`
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
        await this.sql`
          DELETE FROM workout.workout_set
          WHERE
            exercise_to_split_id = ${savedExercise.id};
        `;

        for (const [setIndex, reps] of exercise.sets.entries()) {
          await this.sql`
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
  }
}
