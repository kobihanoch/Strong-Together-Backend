import { z } from 'zod';
import { createUserUserSchema } from '../shared/responseSchemas.ts';

export const createUserResponseSchema = z.object({
  message: z.string(),
  user: createUserUserSchema,
});
