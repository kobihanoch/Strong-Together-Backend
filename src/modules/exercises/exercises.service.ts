import { queryGetExerciseMapByMuscle } from './exercises.queries.ts';
import type { GetAllExercisesResponse } from '@strong-together/shared';

export const getAllExercisesData = async (): Promise<GetAllExercisesResponse> => {
  return queryGetExerciseMapByMuscle();
};
