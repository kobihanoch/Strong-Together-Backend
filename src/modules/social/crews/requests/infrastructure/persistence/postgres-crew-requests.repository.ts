import { Injectable } from '@nestjs/common';
import { CreateMembershipSql } from './writes/create-membership.sql';
import { UpdateStatusSql } from './writes/update-status.sql';
import { RequestToJoinSql } from './writes/request-to-join.sql';
import { InviteUserSql } from './writes/invite-user.sql';
import type { InviteCrewUserOutcome, RequestToJoinCrewOutcome, UpdateCrewParticipationRequestOutcome } from '../../application/models/crew-requests.models';
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
  public invite(crewId: string, initiatorUserId: string, participantUserId: string): Promise<InviteCrewUserOutcome> {
    return this.inviteUserSql.inviteUser(crewId, initiatorUserId, participantUserId);
  }
  public requestToJoin(crewId: string, userId: string): Promise<RequestToJoinCrewOutcome> {
    return this.requestToJoinSql.requestToJoin(crewId, userId);
  }
  public updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<UpdateCrewParticipationRequestOutcome> {
    return this.updateStatusSql.updateStatus(requestId, status);
  }
  public createMembership(crewId: string, userId: string): Promise<void> {
    return this.createMembershipSql.createMembership(crewId, userId);
  }
}
