import { z } from 'zod/v4';
import { userDbSchema } from '../../database';

/** Normalized OAuth-account lookup result returned by query adapters. */
export const oAuthLookupQueryDtoSchema = z.object({
  userId: userDbSchema.shape.id.nullable(),
});

/** Raw OAuth lookup function payload using database column names. */
export const oAuthLookupRawQueryDtoSchema = z.object({
  user_id: userDbSchema.shape.id,
});

/** SQL row wrapping the raw OAuth lookup payload under `oauth_data`. */
export const oAuthLookupRowQueryDtoSchema = z.object({
  oauth_data: oAuthLookupRawQueryDtoSchema.nullable(),
});

/** Normalized result of attempting to link an OAuth account by email. */
export const oAuthLinkQueryDtoSchema = z.object({ userId: userDbSchema.shape.id.nullable() });

/** SQL row returned by the OAuth link-by-email function. */
export const oAuthLinkRowQueryDtoSchema = z.object({ user_id: userDbSchema.shape.id.nullable() });

/** SQL row returned after creating a user through an OAuth provider. */
export const oAuthCreatedUserRowQueryDtoSchema = z.object({ user_id: userDbSchema.shape.id });

export type OAuthLookupQueryDto = z.infer<typeof oAuthLookupQueryDtoSchema>;
export type OAuthLookupRawQueryDto = z.infer<typeof oAuthLookupRawQueryDtoSchema>;
export type OAuthLookupRowQueryDto = z.infer<typeof oAuthLookupRowQueryDtoSchema>;
export type OAuthLinkQueryDto = z.infer<typeof oAuthLinkQueryDtoSchema>;
export type OAuthLinkRowQueryDto = z.infer<typeof oAuthLinkRowQueryDtoSchema>;
export type OAuthCreatedUserRowQueryDto = z.infer<typeof oAuthCreatedUserRowQueryDtoSchema>;
