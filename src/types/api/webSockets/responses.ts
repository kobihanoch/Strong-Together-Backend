import z from 'zod';
import { generateTicketResponseSchema } from '../../../features/webSockets/generateTicketResponse.schema.ts';

export type GenerateTicketResponse = z.infer<typeof generateTicketResponseSchema>;
