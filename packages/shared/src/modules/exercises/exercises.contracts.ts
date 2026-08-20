import z from 'zod/v4';
import { getAllExercisesResponseSchema } from './exercises.schemas';

export type GetAllExercisesResponse = z.infer<typeof getAllExercisesResponseSchema>;
