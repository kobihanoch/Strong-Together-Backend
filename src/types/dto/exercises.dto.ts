import type { ExerciseEntity } from '../entities/exercise.entity.ts';

export interface GetAllExercisesExercise {
  id: ExerciseEntity['id'];
  name: ExerciseEntity['name'];
  specificTargetMuscle: ExerciseEntity['specifictargetmuscle'];
}

export type ExercisesMapByMuscle = Record<ExerciseEntity['targetmuscle'], GetAllExercisesExercise[]>;

export type QueryGetExerciseMapByMuscleRow = {
  result: {
    map: ExercisesMapByMuscle | null;
  } | null;
};
