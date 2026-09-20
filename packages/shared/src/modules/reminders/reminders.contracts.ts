import { z } from 'zod/v4';
import { serializedDateSchema, timezoneSchema, type BodyOf, type Contract, type ResponseOf } from '../../common';

const reminderSettingsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  reminderEnabled: z.boolean(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  timeZone: timezoneSchema,
});

export const getReminderSettingsResponseSchema = z.object({
  reminderSettings: reminderSettingsSchema.nullable(),
});

export const getReminderSettingsContract = {
  response: getReminderSettingsResponseSchema,
} satisfies Contract;

export const upsertReminderSettingsRequestSchema = z.object({
  body: z.object({
    reminderEnabled: z.boolean(),
    timeZone: timezoneSchema,
  }),
});

export const upsertReminderSettingsContract = {
  request: upsertReminderSettingsRequestSchema,
  response: z.void(),
} satisfies Contract;

export const updateReminderTimeZoneRequestSchema = z.object({
  body: z.object({
    timeZone: timezoneSchema,
  }),
});

export const updateReminderTimeZoneContract = {
  request: updateReminderTimeZoneRequestSchema,
  response: z.void(),
} satisfies Contract;

export type UpsertReminderSettingsBody = BodyOf<typeof upsertReminderSettingsContract>;
export type UpsertReminderSettingsResponse = ResponseOf<typeof upsertReminderSettingsContract>;
export type UpdateReminderTimeZoneBody = BodyOf<typeof updateReminderTimeZoneContract>;
export type UpdateReminderTimeZoneResponse = ResponseOf<typeof updateReminderTimeZoneContract>;
export type GetReminderSettingsResponse = ResponseOf<typeof getReminderSettingsContract>;
