import type { ExerciseCatalogue } from '../models/exercises.models';

/** Read operations required by application queries. */
export abstract class ExercisesQueries {
  abstract findCatalogue(): Promise<ExerciseCatalogue>;
}
