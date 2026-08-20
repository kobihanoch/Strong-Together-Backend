import { z } from 'zod/v4';
import { userDbSchema } from '../../database';

export const generateTicketRequest = z.object({
  body: z.object({
    username: userDbSchema.shape.username,
  }),
});

export const generateTicketResponseSchema = z.object({
  ticket: z.string(),
});
