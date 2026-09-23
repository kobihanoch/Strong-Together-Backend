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

/** Represents the upsert reminder settings body value. */
export type UpsertReminderSettingsBody = BodyOf<typeof upsertReminderSettingsContract>;
/** Represents the upsert reminder settings response value. */
export type UpsertReminderSettingsResponse = ResponseOf<typeof upsertReminderSettingsContract>;
/** Represents the update reminder time zone body value. */
export type UpdateReminderTimeZoneBody = BodyOf<typeof updateReminderTimeZoneContract>;
/** Represents the update reminder time zone response value. */
export type UpdateReminderTimeZoneResponse = ResponseOf<typeof updateReminderTimeZoneContract>;
/** Represents the get reminder settings response value. */
export type GetReminderSettingsResponse = ResponseOf<typeof getReminderSettingsContract>;
