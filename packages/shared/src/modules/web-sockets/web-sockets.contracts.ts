import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';

// Generate WebSocket ticket

export const createWebSocketTicketRequestSchema = z.object({
  body: z.object({ username: z.string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Invalid username') }),
});
export const createWebSocketTicketResponseSchema = z.object({ ticket: z.string() });

export const createWebSocketTicketContract = {
  request: createWebSocketTicketRequestSchema,
  response: createWebSocketTicketResponseSchema,
} satisfies Contract;

/** Represents the create web socket ticket body value. */
export type CreateWebSocketTicketBody = BodyOf<typeof createWebSocketTicketContract>;
/** Represents the create web socket ticket response value. */
export type CreateWebSocketTicketResponse = ResponseOf<typeof createWebSocketTicketContract>;
