import { z } from 'zod';
import { userDataSchema } from '../../validators/shared/responseSchemas.ts';

export const updateAuthenticatedUserResponseSchema = z.object({
  message: z.string(),
  emailChanged: z.boolean(),
  user: userDataSchema,
});
