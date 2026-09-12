import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateCrewBody, CrewQueryDto, ListCrewParticipantsResponse, ListCrewsResponse, UpdateCrewBody } from '@strong-together/shared';
import { CrewsQueries } from './crews.queries';
import { decodeSocialCursor, encodeSocialCursor } from '../cursor-pagination';
/** Coordinates social crew CRUD operations and maps empty query results to HTTP errors. */
@Injectable()
export class CrewsService {
  constructor(private readonly queries: CrewsQueries) {}

  /**
   * Lists discoverable crews with a limited participant preview.
   *
   * @param limit - The maximum number of crews to return.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns A contract object containing the visible crews.
   */
  async listCrewsData(limit: number, cursor?: string): Promise<ListCrewsResponse> {
    const rows = await this.queries.queryCrews(limit, decodeSocialCursor(cursor));
    const crews = rows.slice(0, limit);
    const last = crews.at(-1);
    return { crews, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
  }

  /**
   * Lists active participants when the crew is public or the caller belongs to it.
   *
   * @param crewId - The UUID of the crew whose participants are requested.
   * @param limit - The maximum number of participants to return.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns A contract object containing the authorized participant rows.
   */
  async listCrewParticipantsData(crewId: string, limit: number, cursor?: string): Promise<ListCrewParticipantsResponse> {
    const decodedCursor = decodeSocialCursor(cursor);
    const rows = await this.queries.queryCrewParticipants(
      crewId,
      limit,
      decodedCursor ? { timestamp: decodedCursor.timestamp, id: decodedCursor.id, rank: decodedCursor.rank } : undefined,
    );
    const participants = rows.slice(0, limit);
    const last = participants.at(-1);
    const rank = last?.role === 'leader' ? 1 : last?.role === 'admin' ? 2 : 3;
    return {
      participants,
      nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.joinedAt, id: last.id, rank }) : null,
    };
  }
  /**
   * Gets one visible crew.
   *
   * @param id - The crew UUID.
   * @returns The matching crew.
   * @throws NotFoundException when the query returns no visible crew.
   */
  async getCrewData(id: string): Promise<CrewQueryDto> {
    const [row] = await this.queries.queryCrew(id);
    if (!row) throw new NotFoundException('Crew not found');
    return row;
  }
  /**
   * Creates a crew and assigns its creator as the leader.
   *
   * @param userId - The authenticated creator's UUID.
   * @param body - The validated crew creation data.
   * @returns A promise that resolves after creation.
   */
  async createCrewData(userId: string, body: CreateCrewBody): Promise<void> {
    await this.queries.queryCreateCrew(userId, body.name, body.privacy);
  }
  /**
   * Updates a crew through the caller's RLS transaction.
   *
   * @param id - The crew UUID.
   * @param body - The validated crew update data.
   * @returns A promise that resolves after the update.
   * @throws NotFoundException when no permitted crew is updated.
   */
  async updateCrewData(id: string, body: UpdateCrewBody): Promise<void> {
    const [row] = await this.queries.queryUpdateCrew(id, body.name, body.privacy);
    if (!row) throw new NotFoundException('Crew not found');
  }

  /**
   * Leaves a crew and transfers leadership when the caller is its leader.
   * If no succsor found - means no other users in crew. SO leave crew and delete it.
   *
   * @param crewId - The UUID of the crew the current user wants to leave.
   * @returns A promise that resolves after the membership is marked as left.
   * @throws NotFoundException when the caller has no active crew membership.
   */
  async leaveCrewData(crewId: string): Promise<void> {
    const [outcome] = await this.queries.queryLeaveCrew(crewId);

    if (!outcome || outcome.result === 'not_member') {
      throw new NotFoundException('Active crew membership not found');
    }
  }

  /**
   * Deletes a crew through the caller's RLS transaction.
   *
   * @param id - The crew UUID.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when no permitted crew is deleted.
   */
  async deleteCrewData(id: string): Promise<void> {
    if (!(await this.queries.queryDeleteCrew(id)).length) throw new NotFoundException('Crew not found');
  }

  /**
   * Creates a pending crew invitation.
   * @param crewId - The crew UUID.
   * @param initiatorUserId - The authenticated initiator UUID.
   * @param participantUserId - The invited user UUID.
   * @returns A promise that resolves after creation.
   * @throws NotFoundException when RLS exposes no crew.
   */
  async inviteUserData(crewId: string, initiatorUserId: string, participantUserId: string): Promise<void> {
    const [request] = await this.queries.queryInviteUser(crewId, initiatorUserId, participantUserId);
    if (!request) throw new NotFoundException('Crew not found');
  }

  /**
   * Requests crew membership and completes public joins immediately.
   * @param crewId - The crew UUID.
   * @param userId - The requesting user UUID.
   * @returns A promise that resolves after the request is handled.
   * @throws NotFoundException when RLS exposes no crew.
   */
  async requestToJoinData(crewId: string, userId: string): Promise<void> {
    const [request] = await this.queries.queryRequestToJoin(crewId, userId);
    if (!request) throw new NotFoundException('Crew not found');
    if (request.status === 'accepted') {
      await this.queries.queryCreateMembershipFromAcceptedRequest(request.id);
    }
  }

  async updateCrewMemberRequestStatus(crewId: string, requestId: string): Promise<void> {}
  /**
   * Accepts a join request and creates its membership.
   * @param crewId - The crew UUID.
   * @param requestId - The join request UUID.
   * @returns A promise that resolves after acceptance.
   * @throws NotFoundException when RLS exposes no matching request.
   */
  async acceptJoinRequestData(crewId: string, requestId: string): Promise<void> {
    const [accepted] = await this.queries.queryAcceptJoinRequest(crewId, requestId);
    if (!accepted) throw new NotFoundException('Join request not found');
    await this.queries.queryCreateMembershipFromAcceptedRequest(accepted.id);
  }

  /**
   * Accepts an invitation and creates its membership.
   * @param crewId - The crew UUID.
   * @param requestId - The invitation UUID.
   * @returns A promise that resolves after acceptance.
   * @throws NotFoundException when RLS exposes no matching invitation.
   */
  async acceptInvitationData(crewId: string, requestId: string): Promise<void> {
    const [accepted] = await this.queries.queryAcceptInvitation(crewId, requestId);
    if (!accepted) throw new NotFoundException('Invitation not found');
    await this.queries.queryCreateMembership(accepted.crewId, accepted.participantUserId);
  }
}
