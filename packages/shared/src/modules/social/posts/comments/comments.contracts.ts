import { z } from 'zod/v4';
import type { BodyOf, Contract, ParamsOf, QueryOf, ResponseOf } from '../../../../common';
import { commentDbSchema, postDbSchema } from '../../../../database';
import { commentQueryDtoSchema } from './comments.dtos';

const postParamsSchema = z.object({ postId: postDbSchema.shape.id });
const commentParamsSchema = z.object({ id: commentDbSchema.shape.id });
const commentContentSchema = commentDbSchema.shape.content.trim().min(1).max(2000);

// List post comments

/** Validates cursor pagination for comments on a visible post. */
export const listPostCommentsRequestSchema = z.object({
  params: postParamsSchema,
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.string().min(1).optional(),
  }),
});

/** Validates a page of comments and its continuation cursor. */
export const listPostCommentsResponseSchema = z.object({
  comments: z.array(commentQueryDtoSchema),
  nextCursor: z.string().nullable(),
});

/** Defines the contract for listing comments on a post. */
export const listPostCommentsContract = {
  request: listPostCommentsRequestSchema,
  response: listPostCommentsResponseSchema,
} satisfies Contract;

/** Route parameters accepted by the list-post-comments endpoint. */
export type ListPostCommentsParams = ParamsOf<typeof listPostCommentsContract>;

/** Cursor pagination accepted by the list-post-comments endpoint. */
export type ListPostCommentsQuery = QueryOf<typeof listPostCommentsContract>;

/** Paginated comments returned for a visible post. */
export type ListPostCommentsResponse = ResponseOf<typeof listPostCommentsContract>;

/** Validates a comment to add to a post. */
export const addCommentRequestSchema = z.object({
  params: postParamsSchema,
  body: z.object({ content: commentContentSchema }),
});

/** Defines the contract for adding a comment. */
export const addCommentResponseSchema = z.void();

/** Defines the contract for adding a comment. */
export const addCommentContract = { request: addCommentRequestSchema, response: addCommentResponseSchema } satisfies Contract;

/** Route parameters accepted by the add-comment endpoint. */
export type AddCommentParams = ParamsOf<typeof addCommentContract>;

/** Request body accepted by the add-comment endpoint. */
export type AddCommentBody = BodyOf<typeof addCommentContract>;

/** Empty response returned after adding a comment. */
export type AddCommentResponse = ResponseOf<typeof addCommentContract>;

/** Validates a comment identifier and its replacement content. */
export const editCommentRequestSchema = z.object({
  params: commentParamsSchema,
  body: z.object({ content: commentContentSchema }),
});

/** Defines the contract for editing an authored comment. */
export const editCommentResponseSchema = z.void();

/** Defines the contract for editing an authored comment. */
export const editCommentContract = { request: editCommentRequestSchema, response: editCommentResponseSchema } satisfies Contract;

/** Route parameters accepted by the edit-comment endpoint. */
export type EditCommentParams = ParamsOf<typeof editCommentContract>;

/** Request body accepted by the edit-comment endpoint. */
export type EditCommentBody = BodyOf<typeof editCommentContract>;

/** Empty response returned after editing a comment. */
export type EditCommentResponse = ResponseOf<typeof editCommentContract>;

/** Validates the identifier of a comment to delete. */
export const deleteCommentRequestSchema = z.object({ params: commentParamsSchema });

/** Defines the contract for deleting an authored comment. */
export const deleteCommentResponseSchema = z.void();

/** Defines the contract for deleting an authored comment. */
export const deleteCommentContract = { request: deleteCommentRequestSchema, response: deleteCommentResponseSchema } satisfies Contract;

/** Route parameters accepted by the delete-comment endpoint. */
export type DeleteCommentParams = ParamsOf<typeof deleteCommentContract>;

/** Empty response returned after deleting a comment. */
export type DeleteCommentResponse = ResponseOf<typeof deleteCommentContract>;
