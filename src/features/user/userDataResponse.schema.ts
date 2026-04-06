import { z } from 'zod';
import { userDataSchema } from '../../validators/shared/responseSchemas.ts';

export const userDataResponseSchema = z.object({
  user_data: userDataSchema,
});
