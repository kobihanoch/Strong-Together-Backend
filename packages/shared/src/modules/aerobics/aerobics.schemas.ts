import z from 'zod/v4';
import { serializedDateSchema } from '../../common';
import { aerobicTrackingDbSchema } from '../../database';

const addAerobicInput = z.object({
  durationMins: z.number(),
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  type: aerobicTrackingDbSchema.shape.type,
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

export const aerobicsDailyRecordSchema = z.object({
  type: aerobicTrackingDbSchema.shape.type,
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  durationMins: aerobicTrackingDbSchema.shape.durationSec,
});

export const aerobicsWeeklyRecordSchema = aerobicsDailyRecordSchema.extend({
  workoutTimeUtc: serializedDateSchema,
});

export const weeklyDataSchema = z.object({
  records: z.array(aerobicsWeeklyRecordSchema),
  totalDurationSec: z.number(),
  totalDurationMins: z.number(),
});

export const userAerobicsResponseSchema = z.object({
  daily: z.record(z.string(), z.array(aerobicsDailyRecordSchema)),
  weekly: z.record(z.string(), weeklyDataSchema),
});
