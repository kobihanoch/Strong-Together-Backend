import z from 'zod';
import { getAllExercisesResponseSchema } from '../../../features/exercises/getAllExercisesResponse.schema.ts';

export type GetAllExercisesResponse = z.infer<typeof getAllExercisesResponseSchema>;
