import { exercise } from '../../../infrastructure/db/schema/drizzle/workout/exercises/table';

/** Represents the exercise db row value. */
type ExerciseDbRow = typeof exercise.$inferSelect;

/** Exercise fields embedded in the catalogue JSON aggregation. */
export type ExerciseCatalogueSqlItem = Pick<ExerciseDbRow, 'id' | 'name' | 'specificTargetMuscle'>;

/** Exercise catalogue JSON map returned by PostgreSQL. */
export type ExerciseCatalogueSqlMap = Record<ExerciseDbRow['targetMuscle'], ExerciseCatalogueSqlItem[]>;

/** SQL row wrapping the aggregated exercise catalogue. */
export interface ExerciseCatalogueSqlRow {
  result: { map: ExerciseCatalogueSqlMap | null } | null;
}
