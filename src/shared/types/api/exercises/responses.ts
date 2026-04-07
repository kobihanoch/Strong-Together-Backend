import z from 'zod';
import { getAllExercisesResponseSchema } from '../../../../modules/exercises/exercises.schemas.ts';

export type GetAllExercisesResponse = z.infer<typeof getAllExercisesResponseSchema>;
