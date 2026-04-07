import z from 'zod';
import { bootstrapResponseSchema } from '../../../modules/bootstrap/bootstrap.schemas.ts';

export type BootstrapResponse = z.infer<typeof bootstrapResponseSchema>;
