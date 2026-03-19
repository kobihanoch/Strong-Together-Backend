export interface GetAllExercisesExercise {
  id: string;
  name: string;
  specificTargetMuscle: string;
}

export type ExercisesMapByMuscle = Record<string, GetAllExercisesExercise[]>;

export type GetAllExercsesResponse = ExercisesMapByMuscle;
