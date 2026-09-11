import { z } from 'zod/v4';
import type { BodyOf, Contract, ParamsOf, ResponseOf } from '../../../common';
import { postDbSchema } from '../../../database';
import { postQueryDtoSchema } from './posts.dtos';

const postIdParamsSchema = z.object({ id: postDbSchema.shape.id });

// List posts

/** Validates a request to list posts visible to the authenticated user. */
export const listPostsRequestSchema = z.object({});

/** Validates the collection returned by the list-posts endpoint. */
export const listPostsResponseSchema = z.object({ posts: z.array(postQueryDtoSchema) });

/** Defines the request and response contract for listing visible posts. */
export const listPostsContract = { request: listPostsRequestSchema, response: listPostsResponseSchema } satisfies Contract;

/** Response containing global posts and visible crew posts. */
export type ListPostsResponse = ResponseOf<typeof listPostsContract>;

// Get post

/** Validates the route parameters used to retrieve one post. */
export const getPostRequestSchema = z.object({ params: postIdParamsSchema });

/** Validates the post returned by the get-post endpoint. */
export const getPostResponseSchema = postQueryDtoSchema;

/** Defines the request and response contract for retrieving one post. */
export const getPostContract = { request: getPostRequestSchema, response: getPostResponseSchema } satisfies Contract;

/** Route parameters accepted by the get-post endpoint. */
export type GetPostParams = ParamsOf<typeof getPostContract>;

/** Response returned after retrieving one post. */
export type GetPostResponse = ResponseOf<typeof getPostContract>;

// Create post

/** Validates the body used to create a global or crew-shared post. */
export const createPostRequestSchema = z.object({ body: z.object({ content: postDbSchema.shape.content, crewId: z.uuid().optional() }) });

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
