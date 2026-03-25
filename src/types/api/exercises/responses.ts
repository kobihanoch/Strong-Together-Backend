import z from 'zod';
import { getAllExercisesResponseSchema } from '../../../validators/exercises/getAllExercisesResponse.schema.ts';

export type GetAllExercisesResponse = z.infer<typeof getAllExercisesResponseSchema>;
