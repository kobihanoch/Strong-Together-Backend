import { z } from 'zod/v4';
import { serializedDateSchema, timezoneSchema, type BodyOf, type Contract, type ParamsOf, type QueryOf, type ResponseOf } from '../../common';

const aerobicEntrySchema = z.object({
  durationMins: z.number(),
  durationSec: z.number(),
  type: z.string(),
});

const aerobicsDailyRecordSchema = z.object({
  id: z.number(),
  type: z.string(),
  durationSec: z.number(),
  durationMins: z.number(),
});

const aerobicsWeeklyRecordSchema = aerobicsDailyRecordSchema.extend({
  workoutTimeLocal: serializedDateSchema,
});

const aerobicsWeeklyDataSchema = z.object({
  records: z.array(aerobicsWeeklyRecordSchema),
  totalDurationSec: z.number(),
  totalDurationMins: z.number(),
});

const aerobicHistorySchema = z.object({
  daily: z.record(z.string(), z.array(aerobicsDailyRecordSchema)),
  weekly: z.record(z.string(), aerobicsWeeklyDataSchema),
});

// Create aerobic entry

export const createAerobicEntryRequestSchema = z.object({
  query: z.object({ tz: timezoneSchema.optional() }),
  body: z.object({ record: aerobicEntrySchema }),
});

export const createAerobicEntryResponseSchema = z.void();
export const createAerobicEntryContract = {
  request: createAerobicEntryRequestSchema,
  response: createAerobicEntryResponseSchema,
} satisfies Contract;

// Get aerobic history

export const getAerobicHistoryRequestSchema = z.object({ query: z.object({ tz: timezoneSchema.optional() }) });
export const getAerobicHistoryResponseSchema = aerobicHistorySchema;
export const getAerobicHistoryContract = {
  request: getAerobicHistoryRequestSchema,
  response: getAerobicHistoryResponseSchema,
} satisfies Contract;

const aerobicEntryIdParamsSchema = z.object({ id: z.coerce.number().int().positive() });

export const updateAerobicEntryRequestSchema = z.object({
  params: aerobicEntryIdParamsSchema,
  query: z.object({ tz: timezoneSchema.optional() }),
  body: z.object({ record: aerobicEntrySchema }),
});
export const updateAerobicEntryContract = {
  request: updateAerobicEntryRequestSchema,
  response: z.void(),
} satisfies Contract;

export const deleteAerobicEntryRequestSchema = z.object({
  params: aerobicEntryIdParamsSchema,
  query: z.object({ tz: timezoneSchema.optional() }),
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
