import type { Contract, ResponseOf } from '../../common';
import { exercisesMapByMuscleQueryDtoSchema } from './exercises.dtos';

// List exercises

export const listExercisesResponseSchema = exercisesMapByMuscleQueryDtoSchema;

export const listExercisesContract = { response: listExercisesResponseSchema } satisfies Contract;

export type ListExercisesResponse = ResponseOf<typeof listExercisesContract>;
