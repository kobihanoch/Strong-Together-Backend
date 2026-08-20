import z from 'zod/v4';
import { bootstrapRequest, bootstrapResponseSchema } from './bootstrap.schemas';

export type BootstrapRequestQuery = z.infer<typeof bootstrapRequest.shape.query>;
export type BootstrapResponse = z.infer<typeof bootstrapResponseSchema>;
