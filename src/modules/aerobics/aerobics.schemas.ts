import z from 'zod';
import { userAerobicsResponseSchema } from '../../validators/shared/responseSchemas.ts';

const addAerobicInput = z.object({
  durationMins: z.number(),
  durationSec: z.number(),
  type: z.string(),
});

export const addAerobicsRequest = z.object({
  body: z.object({
    tz: z.string(),
    record: addAerobicInput,
  }),
});

export const getAerobicsRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});

export { userAerobicsResponseSchema };
