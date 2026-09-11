import { z } from 'zod/v4';
import type { BodyOf, Contract, ParamsOf, QueryOf, ResponseOf } from '../../../common';
import { postDbSchema } from '../../../database';
import { postQueryDtoSchema } from './posts.dtos';

const postIdParamsSchema = z.object({ id: postDbSchema.shape.id });

const postPaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// List visible posts

/** Validates a request to list posts visible to the authenticated user. */
export const listVisiblePostsRequestSchema = z.object({ query: postPaginationSchema });

/** Validates the collection returned by the list-posts endpoint. */
export const listVisiblePostsResponseSchema = z.object({ posts: z.array(postQueryDtoSchema) });

/** Defines the request and response contract for listing visible posts. */
export const listVisiblePostsContract = {
  request: listVisiblePostsRequestSchema,
  response: listVisiblePostsResponseSchema,
} satisfies Contract;

/** Pagination query accepted by the list-visible-posts endpoint. */
export type ListVisiblePostsQuery = QueryOf<typeof listVisiblePostsContract>;

/** Response containing each visible post once, regardless of its crew placements. */
export type ListVisiblePostsResponse = ResponseOf<typeof listVisiblePostsContract>;

// List crew posts

/** Validates the crew identifier and pagination used to list a crew's posts. */
export const listCrewPostsRequestSchema = z.object({
  params: z.object({ crewId: z.uuid() }),
  query: postPaginationSchema,
});

/** Validates the collection returned by the list-crew-posts endpoint. */
export const listCrewPostsResponseSchema = z.object({ posts: z.array(postQueryDtoSchema) });

/** Defines the request and response contract for listing posts from one crew. */
export const listCrewPostsContract = {
  request: listCrewPostsRequestSchema,
  response: listCrewPostsResponseSchema,
} satisfies Contract;

/** Route parameters accepted by the list-crew-posts endpoint. */
export type ListCrewPostsParams = ParamsOf<typeof listCrewPostsContract>;

/** Pagination query accepted by the list-crew-posts endpoint. */
export type ListCrewPostsQuery = QueryOf<typeof listCrewPostsContract>;

/** Response containing posts from the requested accessible crew. */
export type ListCrewPostsResponse = ResponseOf<typeof listCrewPostsContract>;

// Create post

const createPostBodySchema = z
  .object({
    content: postDbSchema.shape.content,
    visibility: postDbSchema.shape.visibility,
    crewIds: z.array(z.uuid()).default([]),
  })
  .superRefine((body, context) => {
    // Crew-only posts require at least one audience crew.
    if (body.visibility === 'crews_only' && body.crewIds.length === 0) {
      context.addIssue({ code: 'custom', path: ['crewIds'], message: 'Crew-only posts require at least one crew' });
    }

    // Duplicate placements are rejected before reaching the database constraint.
    if (new Set(body.crewIds).size !== body.crewIds.length) {
      context.addIssue({ code: 'custom', path: ['crewIds'], message: 'Crew IDs must be unique' });
    }
  });

/** Validates a public or crew-only post and all requested crew placements. */
export const createPostRequestSchema = z.object({
  body: createPostBodySchema,
});

/** Validates the empty response returned after post creation. */
export const createPostResponseSchema = z.void();

/** Defines the request and response contract for creating a post. */
export const createPostContract = { request: createPostRequestSchema, response: createPostResponseSchema } satisfies Contract;

/** Request body accepted by the create-post endpoint. */
export type CreatePostBody = BodyOf<typeof createPostContract>;

/** Empty response returned after creating a post. */
export type CreatePostResponse = ResponseOf<typeof createPostContract>;

// Update post

/** Validates the route parameters and body used to update a post. */
export const updatePostRequestSchema = z.object({ params: postIdParamsSchema, body: z.object({ content: postDbSchema.shape.content }) });

/** Validates the empty response returned after updating a post. */
export const updatePostResponseSchema = z.void();

/** Defines the request and response contract for updating a post. */
export const updatePostContract = { request: updatePostRequestSchema, response: updatePostResponseSchema } satisfies Contract;

/** Route parameters accepted by the update-post endpoint. */
export type UpdatePostParams = ParamsOf<typeof updatePostContract>;

/** Request body accepted by the update-post endpoint. */
export type UpdatePostBody = BodyOf<typeof updatePostContract>;

/** Empty response returned after updating a post. */
export type UpdatePostResponse = ResponseOf<typeof updatePostContract>;

// Delete post

/** Validates the route parameters used to delete a post. */
export const deletePostRequestSchema = z.object({ params: postIdParamsSchema });

/** Validates the empty response returned after deleting a post. */
export const deletePostResponseSchema = z.void();

/** Defines the request and response contract for deleting a post. */
export const deletePostContract = { request: deletePostRequestSchema, response: deletePostResponseSchema } satisfies Contract;

/** Route parameters accepted by the delete-post endpoint. */
export type DeletePostParams = ParamsOf<typeof deletePostContract>;

/** Response returned after deleting a post. */
export type DeletePostResponse = ResponseOf<typeof deletePostContract>;
