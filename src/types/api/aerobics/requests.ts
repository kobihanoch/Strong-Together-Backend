import z from 'zod';
import { addAerobicsRequest, getAerobicsRequest } from '../../../modules/aerobics/aerobics.schemas.ts';

export type AddUserAerobicsBody = z.infer<typeof addAerobicsRequest.shape.body>;
export type GetUserAerobicsQuery = z.infer<typeof getAerobicsRequest.shape.query>;
