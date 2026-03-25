import z from 'zod';
import { generateTicketResponseSchema } from '../../../validators/webSockets/generateTicketResponse.schema.ts';

export type GenerateTicketResponse = z.infer<typeof generateTicketResponseSchema>;
