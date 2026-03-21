import z from 'zod';
import { bootstrapRequest } from '../../../validators/bootstrap/bootstrapRequest.schema.ts';

export type BootstrapRequestQuery = z.infer<typeof bootstrapRequest.shape.query>;
