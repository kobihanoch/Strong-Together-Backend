import { z } from 'zod/v4';
import type { BodyOf, Contract, ParamsOf, QueryOf, ResponseOf } from '../../../../common';
import { postDbSchema, reactionDbSchema } from '../../../../database';
import { reactionQueryDtoSchema } from './reactions.dtos';

const postParamsSchema = z.object({ postId: postDbSchema.shape.id });

// List post reactions

/** Validates cursor pagination for reactions on a visible post. */
export const listPostReactionsRequestSchema = z.object({
  params: postParamsSchema,
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.string().min(1).optional(),
  }),
});

/** Validates a page of reactions and its continuation cursor. */
export const listPostReactionsResponseSchema = z.object({
  reactions: z.array(reactionQueryDtoSchema),
  nextCursor: z.string().nullable(),
});

/** Defines the contract for listing reactions on a post. */
export const listPostReactionsContract = {
  request: listPostReactionsRequestSchema,
  response: listPostReactionsResponseSchema,
} satisfies Contract;

/** Route parameters accepted by the list-post-reactions endpoint. */
export type ListPostReactionsParams = ParamsOf<typeof listPostReactionsContract>;

/** Cursor pagination accepted by the list-post-reactions endpoint. */
export type ListPostReactionsQuery = QueryOf<typeof listPostReactionsContract>;

/** Paginated reactions returned for a visible post. */
export type ListPostReactionsResponse = ResponseOf<typeof listPostReactionsContract>;

/** Validates a request that creates or replaces the caller's reaction to a post. */
export const reactToPostRequestSchema = z.object({
  params: postParamsSchema,
  body: z.object({ type: reactionDbSchema.shape.type }),
});

/** Defines the empty response returned after reacting to a post. */
export const reactToPostResponseSchema = z.void();

/** Defines the contract for creating or replacing a reaction. */
export const reactToPostContract = {
  request: reactToPostRequestSchema,
  response: reactToPostResponseSchema,
} satisfies Contract;

/** Route parameters accepted by the react-to-post endpoint. */
export type ReactToPostParams = ParamsOf<typeof reactToPostContract>;
/** Request body accepted by the react-to-post endpoint. */
export type ReactToPostBody = BodyOf<typeof reactToPostContract>;
/** Empty response returned after reacting to a post. */
export type ReactToPostResponse = ResponseOf<typeof reactToPostContract>;

/** Validates the post whose reaction the caller wants to remove. */
export const deleteReactionRequestSchema = z.object({ params: postParamsSchema });

/** Defines the empty response returned after deleting a reaction. */
export const deleteReactionResponseSchema = z.void();

/** Defines the contract for deleting the caller's reaction from a post. */
export const deleteReactionContract = {
  request: deleteReactionRequestSchema,
  response: deleteReactionResponseSchema,
} satisfies Contract;

/** Route parameters accepted by the delete-reaction endpoint. */
export type DeleteReactionParams = ParamsOf<typeof deleteReactionContract>;

/** Empty response returned after deleting a reaction. */
export type DeleteReactionResponse = ResponseOf<typeof deleteReactionContract>;
