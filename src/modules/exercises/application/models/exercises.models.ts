/** Exercise summary exposed by the application catalogue. */
export interface ExerciseCatalogueItem {
  id: number;
  name: string;
  specificTargetMuscle: string;
}

/** Read projection of exercises grouped by target muscle. */
export type ExerciseCatalogue = Record<string, ExerciseCatalogueItem[]>;
