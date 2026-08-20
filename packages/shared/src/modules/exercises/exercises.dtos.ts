import { z } from 'zod/v4';
import {
  getAllExercisesExerciseSchema,
  getAllExercisesResponseSchema,
  queryGetExerciseMapByMuscleRowSchema,
} from './exercises.schemas';

export type GetAllExercisesExercise = z.infer<typeof getAllExercisesExerciseSchema>;
export type ExercisesMapByMuscle = z.infer<typeof getAllExercisesResponseSchema>;
export type QueryGetExerciseMapByMuscleRow = z.infer<typeof queryGetExerciseMapByMuscleRowSchema>;
