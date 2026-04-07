import z from 'zod';
import { generateTicketRequest } from '../../../modules/webSockets/webSockets.schemas.ts';

export type GenerateTicketBody = z.infer<typeof generateTicketRequest.shape.body>;
