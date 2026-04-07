import z from 'zod';
import { generateTicketResponseSchema } from '../../../../modules/webSockets/webSockets.schemas.ts';

export type GenerateTicketResponse = z.infer<typeof generateTicketResponseSchema>;
