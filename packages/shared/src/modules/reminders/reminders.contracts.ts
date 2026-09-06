import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { userReminderSettingDbSchema } from '../../database';

export const upsertReminderSettingsRequestSchema = z.object({
  body: z.object({
    reminderEnabled: userReminderSettingDbSchema.shape.reminderEnabled,
    reminderOffsetMinutes: userReminderSettingDbSchema.shape.reminderOffsetMinutes.int().nonnegative(),
    timeZone: userReminderSettingDbSchema.shape.timeZone.min(1, 'Time zone is required'),
  }),
});

export const upsertReminderSettingsContract = {
  request: upsertReminderSettingsRequestSchema,
  response: z.void(),
} satisfies Contract;

export type UpsertReminderSettingsBody = BodyOf<typeof upsertReminderSettingsContract>;
export type UpsertReminderSettingsResponse = ResponseOf<typeof upsertReminderSettingsContract>;
