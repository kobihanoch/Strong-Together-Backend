import z from 'zod';
import { generateTicketResponseSchema } from '../../../../modules/web-sockets/web-sockets.schemas.ts';

export type GenerateTicketResponse = z.infer<typeof generateTicketResponseSchema>;
