import { z } from 'zod';
import { allUserMessageSchema } from '../../validators/shared/responseSchemas.ts';

export const getAllUserMessagesResponseSchema = z.object({
  messages: z.array(allUserMessageSchema),
});
