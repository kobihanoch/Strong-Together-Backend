import { queryGetExerciseMapByMuscle } from './exercises.queries.ts';
import type { GetAllExercisesResponse } from '../../types/api/exercises/responses.ts';

export const getAllExercisesData = async (): Promise<GetAllExercisesResponse> => {
  return queryGetExerciseMapByMuscle();
};
