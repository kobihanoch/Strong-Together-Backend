import z from 'zod';
import { userAerobicsResponseSchema } from '../../../features/aerobics/userAerobicsResponse.schema.ts';

export type UserAerobicsResponse = z.infer<typeof userAerobicsResponseSchema>;
