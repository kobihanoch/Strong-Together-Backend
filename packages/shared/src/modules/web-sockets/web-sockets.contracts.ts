import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { userDbSchema } from '../../database';

// Generate WebSocket ticket

export const createWebSocketTicketRequestSchema = z.object({ body: z.object({ username: userDbSchema.shape.username }) });
export const createWebSocketTicketResponseSchema = z.object({ ticket: z.string() });

export const createWebSocketTicketContract = {
  request: createWebSocketTicketRequestSchema,
  response: createWebSocketTicketResponseSchema,
} satisfies Contract;

export type CreateWebSocketTicketBody = BodyOf<typeof createWebSocketTicketContract>;
export type CreateWebSocketTicketResponse = ResponseOf<typeof createWebSocketTicketContract>;
