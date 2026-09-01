import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../common';
import { addAerobicInputQueryDtoSchema, userAerobicsQueryDtoSchema } from './aerobics.dtos';

// Create aerobic entry

export const createAerobicEntryRequestSchema = z.object({
  body: z.object({ tz: z.string(), record: addAerobicInputQueryDtoSchema }),
});

export const createAerobicEntryContract = { request: createAerobicEntryRequestSchema } satisfies Contract;

// Get aerobic history

export const getAerobicHistoryRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const getAerobicHistoryResponseSchema = userAerobicsQueryDtoSchema;
export const getAerobicHistoryContract = {
  request: getAerobicHistoryRequestSchema,
  response: getAerobicHistoryResponseSchema,
} satisfies Contract;

export type CreateAerobicEntryBody = BodyOf<typeof createAerobicEntryContract>;
export type GetAerobicHistoryQuery = QueryOf<typeof getAerobicHistoryContract>;
export type GetAerobicHistoryResponse = ResponseOf<typeof getAerobicHistoryContract>;
