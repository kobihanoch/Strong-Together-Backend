import { z } from 'zod/v4';
import type { Contract, QueryOf, ResponseOf } from '../../../common';
import { socialUserQueryDtoSchema } from './social-users.dtos';

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
  users: z.array(socialUserQueryDtoSchema),
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
