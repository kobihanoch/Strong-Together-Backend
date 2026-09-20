import type { ExerciseCatalogue } from '../models/exercises.models';

/** Provides persistence-independent access to the exercise catalogue. */
export abstract class ExercisesRepository {
  abstract findCatalogue(): Promise<ExerciseCatalogue>;
}
