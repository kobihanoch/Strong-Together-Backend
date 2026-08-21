import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../common';
import { addAerobicInputQueryDtoSchema, userAerobicsQueryDtoSchema } from './aerobics.dtos';

// Add aerobic record

export const addAerobicsRequestSchema = z.object({
  body: z.object({ tz: z.string(), record: addAerobicInputQueryDtoSchema }),
});

export const addUserAerobicsContract = { request: addAerobicsRequestSchema } satisfies Contract;

// Get user aerobics

export const getAerobicsRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const userAerobicsResponseSchema = userAerobicsQueryDtoSchema;
export const getUserAerobicsContract = {
  request: getAerobicsRequestSchema,
  response: userAerobicsResponseSchema,
} satisfies Contract;

export type AddUserAerobicsBody = BodyOf<typeof addUserAerobicsContract>;
export type GetUserAerobicsQuery = QueryOf<typeof getUserAerobicsContract>;
export type UserAerobicsResponse = ResponseOf<typeof getUserAerobicsContract>;
