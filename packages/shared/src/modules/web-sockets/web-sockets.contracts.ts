import z from 'zod/v4';
import { generateTicketRequest, generateTicketResponseSchema } from './web-sockets.schemas';

export type GenerateTicketBody = z.infer<typeof generateTicketRequest.shape.body>;
export type GenerateTicketResponse = z.infer<typeof generateTicketResponseSchema>;
