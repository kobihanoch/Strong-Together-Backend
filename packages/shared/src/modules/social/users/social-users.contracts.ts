import { z } from 'zod/v4';
import type { Contract, ParamsOf, QueryOf, ResponseOf } from '../../../common';
import { socialUserSchema } from './social-users.schemas';

/** Validates user-search text and cursor pagination. */
export const searchSocialUsersRequestSchema = z.object({
  query: z.object({
    search: z.string().trim().min(1).max(50),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.string().min(1).optional(),
  }),
});

/** Validates a page of public user search results. */
export const searchSocialUsersResponseSchema = z.object({
  users: z.array(socialUserSchema),
  nextCursor: z.string().nullable(),
});

/** Defines the social user-search request and response. */
export const searchSocialUsersContract = {
  request: searchSocialUsersRequestSchema,
  response: searchSocialUsersResponseSchema,
} satisfies Contract;

/** Query accepted by social user search. */
export type SearchSocialUsersQuery = QueryOf<typeof searchSocialUsersContract>;

/** Response returned by social user search. */
export type SearchSocialUsersResponse = ResponseOf<typeof searchSocialUsersContract>;

/** Validates the user ID used to retrieve one public profile. */
export const getSocialUserRequestSchema = z.object({ params: z.object({ userId: z.string().uuid() }) });

/** Validates the public profile returned for one user. */
export const getSocialUserResponseSchema = socialUserSchema.omit({ createdAt: true });

/** Defines the get-social-user request and response. */
export const getSocialUserContract = {
  request: getSocialUserRequestSchema,
  response: getSocialUserResponseSchema,
} satisfies Contract;

/** Route parameters accepted by the get-social-user endpoint. */
export type GetSocialUserParams = ParamsOf<typeof getSocialUserContract>;

/** Public profile returned by the get-social-user endpoint. */
export type GetSocialUserResponse = ResponseOf<typeof getSocialUserContract>;
