import type { ExercisesMapByMuscleQueryDto } from '@strong-together/shared';

/**
 * Defines the persistence operations required by exercise-catalog use cases.
 *
 * The contract keeps application services independent of SQL, PostgreSQL,
 * and the concrete query implementation used to read exercises.
 */
export abstract class ExercisesRepository {
  /**
   * Retrieves the exercise catalog grouped by target muscle.
   *
   * @returns The complete exercise map grouped by target muscle.
   */
  abstract findExerciseMapByMuscle(): Promise<ExercisesMapByMuscleQueryDto>;
}
