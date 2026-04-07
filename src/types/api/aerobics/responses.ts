import z from 'zod';
import { userAerobicsResponseSchema } from '../../../modules/aerobics/aerobics.schemas.ts';

export type UserAerobicsResponse = z.infer<typeof userAerobicsResponseSchema>;
