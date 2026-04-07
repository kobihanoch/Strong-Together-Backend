import z from 'zod';
import { generateTicketRequest } from '../../../../modules/web-sockets/web-sockets.schemas.ts';

export type GenerateTicketBody = z.infer<typeof generateTicketRequest.shape.body>;
