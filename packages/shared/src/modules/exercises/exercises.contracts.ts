import type { Contract, ResponseOf } from '../../common';
import { exercisesMapByMuscleQueryDtoSchema } from './exercises.dtos';

// Get all exercises

export const getAllExercisesResponseSchema = exercisesMapByMuscleQueryDtoSchema;

export const getAllExercisesContract = { response: getAllExercisesResponseSchema } satisfies Contract;

export type GetAllExercisesResponse = ResponseOf<typeof getAllExercisesContract>;
