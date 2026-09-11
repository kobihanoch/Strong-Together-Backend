import { z } from 'zod/v4';
import type { BodyOf, Contract, ParamsOf, QueryOf, ResponseOf } from '../../../common';
import { crewDbSchema } from '../../../database';
import { crewParticipantQueryDtoSchema, crewQueryDtoSchema, discoverableCrewQueryDtoSchema } from './crews.dtos';

const crewIdParamsSchema = z.object({ id: crewDbSchema.shape.id });

// List crews

/** Validates a request to list crews visible to the authenticated user. */
export const listCrewsRequestSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  }),
});

/** Validates the collection returned by the list-crews endpoint. */
export const listCrewsResponseSchema = z.object({ crews: z.array(discoverableCrewQueryDtoSchema) });

/** Defines the request and response contract for listing visible crews. */
export const listCrewsContract = { request: listCrewsRequestSchema, response: listCrewsResponseSchema } satisfies Contract;

/** Pagination query accepted by the list-crews endpoint. */
export type ListCrewsQuery = QueryOf<typeof listCrewsContract>;

/** Response returned when listing crews visible to the caller. */
export type ListCrewsResponse = ResponseOf<typeof listCrewsContract>;

// List crew participants

/** Validates the crew identifier and pagination for listing participants. */
export const listCrewParticipantsRequestSchema = z.object({
  params: z.object({ crewId: crewDbSchema.shape.id }),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  }),
});

/** Validates the participant collection returned by the endpoint. */
export const listCrewParticipantsResponseSchema = z.object({
  participants: z.array(crewParticipantQueryDtoSchema),
});

/** Defines the request and response contract for listing crew participants. */
export const listCrewParticipantsContract = {
  request: listCrewParticipantsRequestSchema,
  response: listCrewParticipantsResponseSchema,
} satisfies Contract;

/** Route parameters accepted by the list-crew-participants endpoint. */
export type ListCrewParticipantsParams = ParamsOf<typeof listCrewParticipantsContract>;

/** Pagination query accepted by the list-crew-participants endpoint. */
export type ListCrewParticipantsQuery = QueryOf<typeof listCrewParticipantsContract>;

/** Response returned after listing authorized crew participants. */
export type ListCrewParticipantsResponse = ResponseOf<typeof listCrewParticipantsContract>;

// Get crew

/** Validates the route parameters used to retrieve one crew. */
export const getCrewRequestSchema = z.object({ params: crewIdParamsSchema });

/** Validates the crew returned by the get-crew endpoint. */
export const getCrewResponseSchema = crewQueryDtoSchema;

/** Defines the request and response contract for retrieving one crew. */
export const getCrewContract = { request: getCrewRequestSchema, response: getCrewResponseSchema } satisfies Contract;

/** Route parameters accepted by the get-crew endpoint. */
export type GetCrewParams = ParamsOf<typeof getCrewContract>;

/** Response returned after retrieving one crew. */
export type GetCrewResponse = ResponseOf<typeof getCrewContract>;

// Create crew

/** Validates the body used to create a crew. */
export const createCrewRequestSchema = z.object({ body: z.object({ privacy: crewDbSchema.shape.privacy }) });

/** Validates the empty response returned after crew creation. */
export const createCrewResponseSchema = z.void();

/** Defines the request and response contract for creating a crew. */
export const createCrewContract = { request: createCrewRequestSchema, response: createCrewResponseSchema } satisfies Contract;

/** Request body accepted by the create-crew endpoint. */
export type CreateCrewBody = BodyOf<typeof createCrewContract>;

/** Empty response returned after creating a crew. */
export type CreateCrewResponse = ResponseOf<typeof createCrewContract>;

// Update crew

/** Validates the route parameters and body used to update a crew. */
export const updateCrewRequestSchema = z.object({ params: crewIdParamsSchema, body: z.object({ privacy: crewDbSchema.shape.privacy }) });

/** Validates the empty response returned after updating a crew. */
export const updateCrewResponseSchema = z.void();

/** Defines the request and response contract for updating a crew. */
export const updateCrewContract = { request: updateCrewRequestSchema, response: updateCrewResponseSchema } satisfies Contract;

/** Route parameters accepted by the update-crew endpoint. */
export type UpdateCrewParams = ParamsOf<typeof updateCrewContract>;

/** Request body accepted by the update-crew endpoint. */
export type UpdateCrewBody = BodyOf<typeof updateCrewContract>;

/** Empty response returned after updating a crew. */
export type UpdateCrewResponse = ResponseOf<typeof updateCrewContract>;

// Delete crew

/** Validates the route parameters used to delete a crew. */
export const deleteCrewRequestSchema = z.object({ params: crewIdParamsSchema });

/** Validates the empty response returned after deleting a crew. */
export const deleteCrewResponseSchema = z.void();

/** Defines the request and response contract for deleting a crew. */
export const deleteCrewContract = { request: deleteCrewRequestSchema, response: deleteCrewResponseSchema } satisfies Contract;

/** Route parameters accepted by the delete-crew endpoint. */
export type DeleteCrewParams = ParamsOf<typeof deleteCrewContract>;

/** Response returned after deleting a crew. */
export type DeleteCrewResponse = ResponseOf<typeof deleteCrewContract>;
