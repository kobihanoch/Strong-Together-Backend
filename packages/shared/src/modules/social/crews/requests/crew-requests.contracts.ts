import { z } from 'zod/v4';
import type { BodyOf, Contract, ParamsOf, ResponseOf } from '../../../../common';
import { crewParticipationRequestSchema } from './crew-requests.schemas';

const crewParamsSchema = z.object({ crewId: z.string().uuid() });
const requestParamsSchema = z.object({ requestId: z.uuid() });

/** Validates a crew invitation creation request. */
export const inviteCrewUserRequestSchema = z.object({
  params: crewParamsSchema,
  body: z.object({ userId: z.uuid() }),
});
export const inviteCrewUserContract = { request: inviteCrewUserRequestSchema, response: z.void() } satisfies Contract;
/** Represents the invite crew user params value. */
export type InviteCrewUserParams = ParamsOf<typeof inviteCrewUserContract>;
/** Represents the invite crew user body value. */
export type InviteCrewUserBody = BodyOf<typeof inviteCrewUserContract>;
/** Represents the invite crew user response value. */
export type InviteCrewUserResponse = ResponseOf<typeof inviteCrewUserContract>;

/** Validates a request by the authenticated user to join a crew. */
export const requestToJoinCrewRequestSchema = z.object({ params: crewParamsSchema });
export const requestToJoinCrewContract = { request: requestToJoinCrewRequestSchema, response: z.void() } satisfies Contract;
/** Represents the request to join crew params value. */
export type RequestToJoinCrewParams = ParamsOf<typeof requestToJoinCrewContract>;
/** Represents the request to join crew response value. */
export type RequestToJoinCrewResponse = ResponseOf<typeof requestToJoinCrewContract>;

/** Validates an accepted or declined participation-request status update. */
export const updateCrewParticipationRequestStatusRequestSchema = z.object({
  params: requestParamsSchema,
  body: z.object({ status: z.enum(['accepted', 'declined']) }),
});
export const updateCrewParticipationRequestStatusContract = {
  request: updateCrewParticipationRequestStatusRequestSchema,
  response: z.void(),
} satisfies Contract;
/** Represents the update crew participation request status params value. */
export type UpdateCrewParticipationRequestStatusParams = ParamsOf<typeof updateCrewParticipationRequestStatusContract>;
/** Represents the update crew participation request status body value. */
export type UpdateCrewParticipationRequestStatusBody = BodyOf<typeof updateCrewParticipationRequestStatusContract>;
/** Represents the update crew participation request status response value. */
export type UpdateCrewParticipationRequestStatusResponse = ResponseOf<typeof updateCrewParticipationRequestStatusContract>;

/** Validates a request to list invitations addressed to the authenticated user. */
export const listCrewInvitationsRequestSchema = z.object({});
export const listCrewInvitationsResponseSchema = z.object({ invitations: z.array(crewParticipationRequestSchema) });
export const listCrewInvitationsContract = {
  request: listCrewInvitationsRequestSchema,
  response: listCrewInvitationsResponseSchema,
} satisfies Contract;
/** Represents the list crew invitations response value. */
export type ListCrewInvitationsResponse = ResponseOf<typeof listCrewInvitationsContract>;

/** Validates a request to list pending join requests for a crew. */
export const listPendingCrewJoinRequestsRequestSchema = z.object({ params: crewParamsSchema });
export const listPendingCrewJoinRequestsResponseSchema = z.object({ requests: z.array(crewParticipationRequestSchema) });
export const listPendingCrewJoinRequestsContract = {
  request: listPendingCrewJoinRequestsRequestSchema,
  response: listPendingCrewJoinRequestsResponseSchema,
} satisfies Contract;
/** Represents the list pending crew join requests params value. */
export type ListPendingCrewJoinRequestsParams = ParamsOf<typeof listPendingCrewJoinRequestsContract>;
/** Represents the list pending crew join requests response value. */
export type ListPendingCrewJoinRequestsResponse = ResponseOf<typeof listPendingCrewJoinRequestsContract>;
