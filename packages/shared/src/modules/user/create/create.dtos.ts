import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import { userDbSchema } from '../../../database';

/** Normalized user object returned after account creation. */
export const createdUserQueryDtoSchema = z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  email: userDbSchema.shape.email,
  gender: userDbSchema.shape.gender,
  role: userDbSchema.shape.role,
  createdAt: serializedDateSchema,
});

/** Raw account-creation function payload before `created_at` is normalized. */
export const createdUserRawQueryDtoSchema = createdUserQueryDtoSchema
  .omit({ createdAt: true })
  .extend({ created_at: serializedDateSchema });

/** SQL row wrapping the raw created user under `userData`. */
export const createdUserRowQueryDtoSchema = z.object({ userData: createdUserRawQueryDtoSchema });

/** SQL row returned by the username/email existence function. */
export const userExistsQueryDtoSchema = z.object({ id: userDbSchema.shape.id.nullable() });

export type CreatedUserQueryDto = z.infer<typeof createdUserQueryDtoSchema>;
export type CreatedUserRawQueryDto = z.infer<typeof createdUserRawQueryDtoSchema>;
export type CreatedUserRowQueryDto = z.infer<typeof createdUserRowQueryDtoSchema>;
export type UserExistsQueryDto = z.infer<typeof userExistsQueryDtoSchema>;
