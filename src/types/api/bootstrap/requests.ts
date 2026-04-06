import z from 'zod';
import { bootstrapRequest } from '../../../features/bootstrap/bootstrapRequest.schema.ts';

export type BootstrapRequestQuery = z.infer<typeof bootstrapRequest.shape.query>;
