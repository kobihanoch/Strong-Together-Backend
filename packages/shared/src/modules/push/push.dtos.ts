import { z } from 'zod/v4';
import { userDbSchema } from '../../database';

/** User row returned when selecting all users with push notifications enabled. */
export const userWithNotificationsEnabledQueryDtoSchema = z.object({
  pushToken: userDbSchema.shape.pushToken,
  name: userDbSchema.shape.name,
});
export type UserWithNotificationsEnabledQueryDto = z.infer<typeof userWithNotificationsEnabledQueryDtoSchema>;
