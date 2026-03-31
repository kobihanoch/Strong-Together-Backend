import z from 'zod';
import { addAerobicsRequest } from '../../../validators/aerobics/addUserAerobicsRequest.schema.ts';
import { getAerobicsRequest } from '../../../validators/aerobics/getUserAerobicsRequest.schema.ts';

export type AddUserAerobicsBody = z.infer<typeof addAerobicsRequest.shape.body>;
export type GetUserAerobicsQuery = z.infer<typeof getAerobicsRequest.shape.query>;
