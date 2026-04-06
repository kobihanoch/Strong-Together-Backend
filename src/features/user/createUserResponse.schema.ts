import { z } from 'zod';
import { createUserUserSchema } from '../../validators/shared/responseSchemas.ts';

export const createUserResponseSchema = z.object({
  message: z.string(),
  user: createUserUserSchema,
});
