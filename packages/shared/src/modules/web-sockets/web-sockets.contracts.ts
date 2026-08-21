import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { userDbSchema } from '../../database';

// Generate WebSocket ticket

export const generateTicketRequestSchema = z.object({ body: z.object({ username: userDbSchema.shape.username }) });
export const generateTicketResponseSchema = z.object({ ticket: z.string() });

export const generateTicketContract = {
  request: generateTicketRequestSchema,
  response: generateTicketResponseSchema,
} satisfies Contract;

export type GenerateTicketBody = BodyOf<typeof generateTicketContract>;
export type GenerateTicketResponse = ResponseOf<typeof generateTicketContract>;
