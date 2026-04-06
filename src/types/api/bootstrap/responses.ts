import z from 'zod';
import { bootstrapResponseSchema } from '../../../features/bootstrap/bootstrapResponse.schema.ts';

export type BootstrapResponse = z.infer<typeof bootstrapResponseSchema>;
