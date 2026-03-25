import { z } from 'zod';
import { userDataSchema } from '../shared/responseSchemas.ts';

export const updateAuthenticatedUserResponseSchema = z.object({
  message: z.string(),
  emailChanged: z.boolean(),
  user: userDataSchema,
});
