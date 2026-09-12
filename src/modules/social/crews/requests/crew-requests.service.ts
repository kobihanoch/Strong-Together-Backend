import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { ListCrewInvitationsResponse, ListPendingCrewJoinRequestsResponse } from '@strong-together/shared';
import { CrewRequestsQueries } from './crew-requests.queries';

/**
 * Coordinates crew participation-request workflows and maps inaccessible query
 * results to HTTP errors.
 *
 * @remarks
 * All persistence calls execute inside the controller's RLS transaction. This
 * service handles workflow side effects, while PostgreSQL policies remain the
 * source of truth for authorization.
 */
@Injectable()
export class CrewRequestsService {
  constructor(private readonly queries: CrewRequestsQueries) {}

  /**
   * Creates a pending crew invitation.
   *
   * @param crewId - The UUID of the crew receiving the invitation.
   * @param initiatorUserId - The UUID of the authenticated invitation initiator.
   * @param participantUserId - The UUID of the user being invited.
   * @returns A promise that resolves after the invitation is created.
   * @throws NotFoundException When RLS permits no matching crew or invitation insertion.
   */
  async inviteUser(crewId: string, initiatorUserId: string, participantUserId: string): Promise<void> {
    const [request] = await this.queries.queryInviteUser(crewId, initiatorUserId, participantUserId);
    if (!request) throw new NotFoundException('Crew not found');
  }

  /**
   * Creates a participation request for the authenticated user.
   *
   * @remarks
   * Requests for public crews are inserted as accepted and immediately produce
   * active membership. Requests for private crews remain pending.
   *
   * @param crewId - The UUID of the crew the user wants to join.
   * @param userId - The UUID of the authenticated requesting user.
   * @returns A promise that resolves after the request and any immediate membership are created.
   * @throws NotFoundException When RLS exposes no matching crew for request creation.
   */
  async requestToJoin(crewId: string, userId: string): Promise<void> {
    const [request] = await this.queries.queryRequestToJoin(crewId, userId);
    if (!request) throw new NotFoundException('Crew not found');
    if (request.status === 'accepted') await this.queries.queryCreateMembership(request.crewId, request.participantUserId);
  }

  /**
   * Lists all invitations addressed to the authenticated database user.
   *
   * @returns A contract response containing every RLS-visible invitation.
   */
  async listInvitations(): Promise<ListCrewInvitationsResponse> {
    return { invitations: await this.queries.queryListInvitations() };
  }

  /**
   * Lists pending join requests for a crew managed by the caller.
   *
   * @param crewId - The UUID of the crew whose pending requests are requested.
   * @returns A contract response containing pending self-initiated join requests.
   * @throws ForbiddenException When the caller is not the active crew leader.
   */
  async listPendingJoinRequests(crewId: string): Promise<ListPendingCrewJoinRequestsResponse> {
    if (!(await this.queries.queryIsCrewLeader(crewId))) throw new ForbiddenException('Crew request access denied');
    return { requests: await this.queries.queryListPendingJoinRequests(crewId) };
  }

  /**
   * Changes a pending participation request to accepted or declined.
   *
   * @remarks
   * Every accepted request creates membership for the crew and participant from
   * the updated database row. Declined requests have no membership side effect.
   *
   * @param requestId - The UUID of the participation request to resolve.
   * @param status - The terminal request status, either `accepted` or `declined`.
   * @returns A promise that resolves after the status and required side effects are persisted.
   * @throws NotFoundException When the request is absent, inaccessible, or no longer pending.
   */
  async updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<void> {
    const [updated] = await this.queries.queryUpdateStatus(requestId, status);
    if (!updated) throw new NotFoundException('Participation request not found');
    if (updated.status === 'accepted') await this.queries.queryCreateMembership(updated.crewId, updated.participantUserId);
  }
}
