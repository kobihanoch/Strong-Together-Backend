import { z } from 'zod/v4';
import { exerciseDbSchema } from '../../database';

export const getAllExercisesExerciseSchema = z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
});

export const getAllExercisesResponseSchema = z.record(z.string(), z.array(getAllExercisesExerciseSchema));

export const queryGetExerciseMapByMuscleRowSchema = z.object({
  result: z.object({ map: getAllExercisesResponseSchema.nullable() }).nullable(),
});
