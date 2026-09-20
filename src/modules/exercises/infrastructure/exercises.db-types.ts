import type { ExerciseCatalogue } from '../application/models/exercises.models';

export interface ExerciseCatalogueSqlRow {
  result: { map: ExerciseCatalogue | null } | null;
}
