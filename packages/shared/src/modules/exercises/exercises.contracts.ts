import { z } from 'zod/v4';
import type { Contract, ResponseOf } from '../../common';

// List exercises

export const listExercisesResponseSchema = z.record(
  z.string(),
  z.array(z.object({ id: z.number().int(), name: z.string(), specificTargetMuscle: z.string() })),
);

export const listExercisesContract = { response: listExercisesResponseSchema } satisfies Contract;

export type ListExercisesResponse = ResponseOf<typeof listExercisesContract>;
