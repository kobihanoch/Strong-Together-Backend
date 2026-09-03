import { z } from 'zod/v4';
import type { BodyOf, Contract, ParamsOf, QueryOf, ResponseOf } from '../../common';
import { addAerobicInputQueryDtoSchema, userAerobicsQueryDtoSchema } from './aerobics.dtos';

// Create aerobic entry

export const createAerobicEntryRequestSchema = z.object({
  query: z.object({ tz: z.string().optional() }),
  body: z.object({ record: addAerobicInputQueryDtoSchema }),
});

export const createAerobicEntryResponseSchema = z.void();
export const createAerobicEntryContract = {
  request: createAerobicEntryRequestSchema,
  response: createAerobicEntryResponseSchema,
} satisfies Contract;

// Get aerobic history

export const getAerobicHistoryRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const getAerobicHistoryResponseSchema = userAerobicsQueryDtoSchema;
export const getAerobicHistoryContract = {
  request: getAerobicHistoryRequestSchema,
  response: getAerobicHistoryResponseSchema,
} satisfies Contract;

const aerobicEntryIdParamsSchema = z.object({ id: z.coerce.number().int().positive() });

export const updateAerobicEntryRequestSchema = z.object({
  params: aerobicEntryIdParamsSchema,
  query: z.object({ tz: z.string().optional() }),
  body: z.object({ record: addAerobicInputQueryDtoSchema }),
});
export const updateAerobicEntryContract = {
  request: updateAerobicEntryRequestSchema,
  response: z.void(),
} satisfies Contract;

export const deleteAerobicEntryRequestSchema = z.object({
  params: aerobicEntryIdParamsSchema,
  query: z.object({ tz: z.string().optional() }),
});
export const deleteAerobicEntryContract = {
  request: deleteAerobicEntryRequestSchema,
  response: z.void(),
} satisfies Contract;

export type CreateAerobicEntryBody = BodyOf<typeof createAerobicEntryContract>;
export type CreateAerobicEntryQuery = QueryOf<typeof createAerobicEntryContract>;
export type GetAerobicHistoryQuery = QueryOf<typeof getAerobicHistoryContract>;
export type GetAerobicHistoryResponse = ResponseOf<typeof getAerobicHistoryContract>;
export type UpdateAerobicEntryBody = BodyOf<typeof updateAerobicEntryContract>;
export type UpdateAerobicEntryParams = ParamsOf<typeof updateAerobicEntryContract>;
export type UpdateAerobicEntryQuery = QueryOf<typeof updateAerobicEntryContract>;
export type UpdateAerobicEntryResponse = ResponseOf<typeof updateAerobicEntryContract>;
export type DeleteAerobicEntryQuery = QueryOf<typeof deleteAerobicEntryContract>;
export type DeleteAerobicEntryParams = ParamsOf<typeof deleteAerobicEntryContract>;
export type DeleteAerobicEntryResponse = ResponseOf<typeof deleteAerobicEntryContract>;
