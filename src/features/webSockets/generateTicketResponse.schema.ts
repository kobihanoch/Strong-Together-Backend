import { z } from 'zod';

export const generateTicketResponseSchema = z.object({
  ticket: z.string(),
});
