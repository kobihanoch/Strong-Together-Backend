import z from 'zod/v4';
import { addAerobicsRequest, getAerobicsRequest, userAerobicsResponseSchema } from './aerobics.schemas';

export type AddUserAerobicsBody = z.infer<typeof addAerobicsRequest.shape.body>;

export type GetUserAerobicsQuery = z.infer<typeof getAerobicsRequest.shape.query>;
export type UserAerobicsResponse = z.infer<typeof userAerobicsResponseSchema>;
