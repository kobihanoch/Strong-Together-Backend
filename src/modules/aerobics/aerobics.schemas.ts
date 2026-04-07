import z from 'zod';

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

export const aerobicsDailyRecordSchema = z.object({
  type: z.string(),
  duration_sec: z.number(),
  duration_mins: z.number(),
});

export const aerobicsWeeklyRecordSchema = aerobicsDailyRecordSchema.extend({
  workout_time_utc: z.string(),
});

export const weeklyDataSchema = z.object({
  records: z.array(aerobicsWeeklyRecordSchema),
  total_duration_sec: z.number(),
  total_duration_mins: z.number(),
});

export const userAerobicsResponseSchema = z.object({
  daily: z.record(z.string(), z.array(aerobicsDailyRecordSchema)),
  weekly: z.record(z.string(), weeklyDataSchema),
});
