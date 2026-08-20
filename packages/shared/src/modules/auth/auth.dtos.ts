import { z } from 'zod/v4';
import { serializedDateSchema } from '../../common';
import { userDbSchema } from '../../database';

export const userByIndetifierSchema = z.object({
  id: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  username: userDbSchema.shape.username,
  email: userDbSchema.shape.email.optional(),
  password: userDbSchema.shape.passwordHash,
  role: userDbSchema.shape.role,
  isVerified: userDbSchema.shape.isVerified,
  lastLogin: serializedDateSchema.nullable().optional(),
});

/** Compatibility name retained for existing backend imports. */
export type UserByIndetifier = z.infer<typeof userByIndetifierSchema>;
