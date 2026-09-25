/** Crew invitation or join-request state. */
export type CrewParticipationRequest = {
  id: string;
  crewId: string;
  initiatorUserId: string;
  participantUserId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired';
  createdAt: string;
  updatedAt: string;
  respondedAt: string | null;
};
/** Invitation collection addressed to the caller. */
export type CrewInvitations = { invitations: CrewParticipationRequest[] };
/** Pending requests for a managed crew. */
export type PendingCrewJoinRequests = { requests: CrewParticipationRequest[] };

export type InviteCrewUserOutcome = { kind: 'invited'; request: CrewParticipationRequest } | { kind: 'crew-not-found' };
export type RequestToJoinCrewOutcome = { kind: 'requested'; request: CrewParticipationRequest } | { kind: 'crew-not-found' };
export type UpdateCrewParticipationRequestOutcome =
  | { kind: 'updated'; request: CrewParticipationRequest }
  | { kind: 'not-found' };
