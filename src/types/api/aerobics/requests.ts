import z from 'zod';
import { addAerobicsRequest } from '../../../features/aerobics/addUserAerobicsRequest.schema.ts';
import { getAerobicsRequest } from '../../../features/aerobics/getUserAerobicsRequest.schema.ts';

export type AddUserAerobicsBody = z.infer<typeof addAerobicsRequest.shape.body>;
export type GetUserAerobicsQuery = z.infer<typeof getAerobicsRequest.shape.query>;
