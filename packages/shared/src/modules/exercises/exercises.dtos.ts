import { z } from 'zod/v4';
import { exerciseDbSchema } from '../../database';

/** Exercise row included in the muscle-grouped exercise query result. */
export const getAllExercisesExerciseQueryDtoSchema = z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
});
/** Exercise map grouped by target muscle. */
export const exercisesMapByMuscleQueryDtoSchema = z.record(z.string(), z.array(getAllExercisesExerciseQueryDtoSchema));
/** SQL row wrapping the exercise map under the `result` alias. */
export const exerciseMapByMuscleRowQueryDtoSchema = z.object({
  result: z.object({ map: exercisesMapByMuscleQueryDtoSchema.nullable() }).nullable(),
});
export type GetAllExercisesExerciseQueryDto = z.infer<typeof getAllExercisesExerciseQueryDtoSchema>;
export type ExercisesMapByMuscleQueryDto = z.infer<typeof exercisesMapByMuscleQueryDtoSchema>;
export type ExerciseMapByMuscleRowQueryDto = z.infer<typeof exerciseMapByMuscleRowQueryDtoSchema>;
