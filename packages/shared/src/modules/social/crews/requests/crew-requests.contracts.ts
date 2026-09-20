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
export type InviteCrewUserParams = ParamsOf<typeof inviteCrewUserContract>;
export type InviteCrewUserBody = BodyOf<typeof inviteCrewUserContract>;
export type InviteCrewUserResponse = ResponseOf<typeof inviteCrewUserContract>;

/** Validates a request by the authenticated user to join a crew. */
export const requestToJoinCrewRequestSchema = z.object({ params: crewParamsSchema });
export const requestToJoinCrewContract = { request: requestToJoinCrewRequestSchema, response: z.void() } satisfies Contract;
export type RequestToJoinCrewParams = ParamsOf<typeof requestToJoinCrewContract>;
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
export type UpdateCrewParticipationRequestStatusParams = ParamsOf<typeof updateCrewParticipationRequestStatusContract>;
export type UpdateCrewParticipationRequestStatusBody = BodyOf<typeof updateCrewParticipationRequestStatusContract>;
export type UpdateCrewParticipationRequestStatusResponse = ResponseOf<typeof updateCrewParticipationRequestStatusContract>;

/** Validates a request to list invitations addressed to the authenticated user. */
export const listCrewInvitationsRequestSchema = z.object({});
export const listCrewInvitationsResponseSchema = z.object({ invitations: z.array(crewParticipationRequestSchema) });
export const listCrewInvitationsContract = {
  request: listCrewInvitationsRequestSchema,
  response: listCrewInvitationsResponseSchema,
} satisfies Contract;
export type ListCrewInvitationsResponse = ResponseOf<typeof listCrewInvitationsContract>;

/** Validates a request to list pending join requests for a crew. */
export const listPendingCrewJoinRequestsRequestSchema = z.object({ params: crewParamsSchema });
export const listPendingCrewJoinRequestsResponseSchema = z.object({ requests: z.array(crewParticipationRequestSchema) });
export const listPendingCrewJoinRequestsContract = {
  request: listPendingCrewJoinRequestsRequestSchema,
  response: listPendingCrewJoinRequestsResponseSchema,
} satisfies Contract;
export type ListPendingCrewJoinRequestsParams = ParamsOf<typeof listPendingCrewJoinRequestsContract>;
export type ListPendingCrewJoinRequestsResponse = ResponseOf<typeof listPendingCrewJoinRequestsContract>;
