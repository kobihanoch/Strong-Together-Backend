import { Injectable } from '@nestjs/common';
import { CreateMembershipSql } from './writes/create-membership.sql';
import { UpdateStatusSql } from './writes/update-status.sql';
import { RequestToJoinSql } from './writes/request-to-join.sql';
import { InviteUserSql } from './writes/invite-user.sql';
import type { CrewParticipationRequest } from '../../application/models/crew-requests.models';
import { CrewRequestsRepository } from '../../application/ports/crew-requests.repository';
/** PostgreSQL implementation of crew participation-request persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresCrewRequestsRepository implements CrewRequestsRepository {
  public constructor(
    private readonly inviteUserSql: InviteUserSql,
    private readonly requestToJoinSql: RequestToJoinSql,
    private readonly updateStatusSql: UpdateStatusSql,
    private readonly createMembershipSql: CreateMembershipSql,
  ) {}
  public async invite(crewId: string, initiatorUserId: string, participantUserId: string): Promise<CrewParticipationRequest | null> {
    return (await this.inviteUserSql.inviteUser(crewId, initiatorUserId, participantUserId))[0] ?? null;
  }
  public async requestToJoin(crewId: string, userId: string): Promise<CrewParticipationRequest | null> {
    return (await this.requestToJoinSql.requestToJoin(crewId, userId))[0] ?? null;
  }
  public async updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<CrewParticipationRequest | null> {
    return (await this.updateStatusSql.updateStatus(requestId, status))[0] ?? null;
  }
  public createMembership(crewId: string, userId: string): Promise<void> {
    return this.createMembershipSql.createMembership(crewId, userId);
  }
}
