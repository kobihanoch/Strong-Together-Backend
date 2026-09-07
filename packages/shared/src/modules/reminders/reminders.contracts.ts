import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { userReminderSettingDbSchema } from '../../database';

export const getReminderSettingsResponseSchema = z.object({
  reminderSettings: userReminderSettingDbSchema.nullable(),
});

export const getReminderSettingsContract = {
  response: getReminderSettingsResponseSchema,
} satisfies Contract;

export const upsertReminderSettingsRequestSchema = z.object({
  body: z.object({
    reminderEnabled: userReminderSettingDbSchema.shape.reminderEnabled,
    timeZone: userReminderSettingDbSchema.shape.timeZone.min(1, 'Time zone is required'),
  }),
});

export const upsertReminderSettingsContract = {
  request: upsertReminderSettingsRequestSchema,
  response: z.void(),
} satisfies Contract;

export type UpsertReminderSettingsBody = BodyOf<typeof upsertReminderSettingsContract>;
export type UpsertReminderSettingsResponse = ResponseOf<typeof upsertReminderSettingsContract>;
export type GetReminderSettingsResponse = ResponseOf<typeof getReminderSettingsContract>;
