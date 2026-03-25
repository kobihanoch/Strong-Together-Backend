import { z } from 'zod';
import { allUserMessageSchema } from '../shared/responseSchemas.ts';

export const getAllUserMessagesResponseSchema = z.object({
  messages: z.array(allUserMessageSchema),
});
