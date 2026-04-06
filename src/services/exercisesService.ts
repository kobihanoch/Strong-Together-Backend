import { queryGetExerciseMapByMuscle } from '../queries/exercisesQueries.js';
import type { GetAllExercisesResponse } from '../types/api/exercises/responses.ts';

export const getAllExercisesData = async (): Promise<GetAllExercisesResponse> => {
  return queryGetExerciseMapByMuscle();
};
