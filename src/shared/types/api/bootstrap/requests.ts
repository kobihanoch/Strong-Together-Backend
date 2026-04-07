import z from 'zod';
import { bootstrapRequest } from '../../../../modules/bootstrap/bootstrap.schemas.ts';

export type BootstrapRequestQuery = z.infer<typeof bootstrapRequest.shape.query>;
