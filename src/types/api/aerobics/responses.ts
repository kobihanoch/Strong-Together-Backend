import z from 'zod';
import { userAerobicsResponseSchema } from '../../../validators/aerobics/userAerobicsResponse.schema.ts';

export type UserAerobicsResponse = z.infer<typeof userAerobicsResponseSchema>;
