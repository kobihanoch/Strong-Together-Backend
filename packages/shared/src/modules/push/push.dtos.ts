import { z } from 'zod/v4';
import { userDbSchema, workoutSplitDbSchema } from '../../database';

/** User row returned when selecting all users with push notifications enabled. */
export const userWithNotificationsEnabledQueryDtoSchema = z.object({
  pushToken: userDbSchema.shape.pushToken,
  name: userDbSchema.shape.name,
});

/** Reminder recipient row returned by the hourly reminder selection query. */
export const userToHourlyReminderQueryDtoSchema = z.object({
  userId: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  pushToken: userDbSchema.shape.pushToken,
  reminderOffsetMinutes: z.number(),
  splitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name.nullable(),
  estimatedTimeUtc: z.string(),
});

export type UserWithNotificationsEnabledQueryDto = z.infer<typeof userWithNotificationsEnabledQueryDtoSchema>;
export type UserToHourlyReminderQueryDto = z.infer<typeof userToHourlyReminderQueryDtoSchema>;
