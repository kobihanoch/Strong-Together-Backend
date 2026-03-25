import { z } from 'zod';
import { userDataSchema } from '../shared/responseSchemas.ts';

export const userDataResponseSchema = z.object({
  user_data: userDataSchema,
});
