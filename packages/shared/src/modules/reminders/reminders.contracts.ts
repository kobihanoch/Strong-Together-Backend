import { z } from 'zod/v4';
import { serializedDateSchema, timezoneSchema, type BodyOf, type Contract, type ResponseOf } from '../../common';
import { userReminderSettingDbSchema } from '../../database';

export const getReminderSettingsResponseSchema = z.object({
  reminderSettings: userReminderSettingDbSchema
    .extend({ createdAt: serializedDateSchema, updatedAt: serializedDateSchema })
    .nullable(),
});

export const getReminderSettingsContract = {
  response: getReminderSettingsResponseSchema,
} satisfies Contract;

export const upsertReminderSettingsRequestSchema = z.object({
  body: z.object({
    reminderEnabled: userReminderSettingDbSchema.shape.reminderEnabled,
    timeZone: timezoneSchema,
  }),
});

export const upsertReminderSettingsContract = {
  request: upsertReminderSettingsRequestSchema,
  response: z.void(),
} satisfies Contract;

export type UpsertReminderSettingsBody = BodyOf<typeof upsertReminderSettingsContract>;
export type UpsertReminderSettingsResponse = ResponseOf<typeof upsertReminderSettingsContract>;
export type GetReminderSettingsResponse = ResponseOf<typeof getReminderSettingsContract>;
