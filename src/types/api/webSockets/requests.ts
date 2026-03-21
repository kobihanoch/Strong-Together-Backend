import z from 'zod';
import { generateTicketRequest } from '../../../validators/webSockets/generateTicketRequest.schema.ts';

export type GenerateTicketBody = z.infer<typeof generateTicketRequest.shape.body>;
