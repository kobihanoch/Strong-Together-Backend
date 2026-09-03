import { z } from 'zod/v4';
import { serializedDateSchema } from '../../common';
import { aerobicTrackingDbSchema } from '../../database';

/** Aerobic record accepted by the insert query. */
export const addAerobicInputQueryDtoSchema = z.object({
  durationMins: z.number(),
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  type: aerobicTrackingDbSchema.shape.type,
});

/** Daily aerobic record produced by the aerobics aggregation query. */
export const aerobicsDailyRecordQueryDtoSchema = z.object({
  id: aerobicTrackingDbSchema.shape.id,
  type: aerobicTrackingDbSchema.shape.type,
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  durationMins: aerobicTrackingDbSchema.shape.durationSec,
});
/** Weekly aerobic record with its localized workout timestamp. */
export const aerobicsWeeklyRecordQueryDtoSchema = aerobicsDailyRecordQueryDtoSchema.extend({
  workoutTimeLocal: serializedDateSchema,
});
/** Weekly aerobic aggregation containing records and duration totals. */
export const weeklyDataQueryDtoSchema = z.object({
  records: z.array(aerobicsWeeklyRecordQueryDtoSchema),
  totalDurationSec: z.number(),
  totalDurationMins: z.number(),
});

/** Complete aerobics aggregate returned by the history SQL query. */
export const userAerobicsQueryDtoSchema = z.object({
  daily: z.record(z.string(), z.array(aerobicsDailyRecordQueryDtoSchema)),
  weekly: z.record(z.string(), weeklyDataQueryDtoSchema),
});

/** SQL row wrapping the aerobics aggregate under the selected `data` alias. */
export const userAerobicsRowQueryDtoSchema = z.object({ data: userAerobicsQueryDtoSchema });

/** Row returned after mutating an aerobic entry owned by a user. */
export const aerobicMutationRowQueryDtoSchema = z.object({ id: aerobicTrackingDbSchema.shape.id });

// SQL query input DTOs

export type AddAerobicInputQueryDto = z.infer<typeof addAerobicInputQueryDtoSchema>;
export type AerobicsDailyRecordQueryDto = z.infer<typeof aerobicsDailyRecordQueryDtoSchema>;
export type AerobicsWeeklyRecordQueryDto = z.infer<typeof aerobicsWeeklyRecordQueryDtoSchema>;
export type WeeklyDataQueryDto = z.infer<typeof weeklyDataQueryDtoSchema>;
export type UserAerobicsQueryDto = z.infer<typeof userAerobicsQueryDtoSchema>;
export type UserAerobicsRowQueryDto = z.infer<typeof userAerobicsRowQueryDtoSchema>;
export type AerobicMutationRowQueryDto = z.infer<typeof aerobicMutationRowQueryDtoSchema>;
