import { z } from 'zod';

export const generateTicketRequest = z.object({
  body: z.object({
    username: z.string(),
  }),
});

export const generateTicketResponseSchema = z.object({
  ticket: z.string(),
});
