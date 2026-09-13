import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import { userDbSchema } from '../../../database';

/** Public profile fields returned by social user search. */
export const socialUserQueryDtoSchema = z.object({
  userId: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  fullName: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath,
  createdAt: serializedDateSchema,
});

/** A public user profile returned by social search. */
export type SocialUserQueryDto = typeof socialUserQueryDtoSchema._output;
