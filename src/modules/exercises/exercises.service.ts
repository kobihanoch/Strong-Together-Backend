import { queryGetExerciseMapByMuscle } from './exercises.queries.ts';
import type { GetAllExercisesResponse } from '../../shared/types/api/exercises/responses.ts';

export const getAllExercisesData = async (): Promise<GetAllExercisesResponse> => {
  return queryGetExerciseMapByMuscle();
};
