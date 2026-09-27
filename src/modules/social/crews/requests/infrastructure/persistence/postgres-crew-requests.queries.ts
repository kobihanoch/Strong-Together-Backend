import { Injectable } from '@nestjs/common';
import { ListPendingJoinRequestsSql } from './reads/list-pending-join-requests.sql';
import { IsCrewLeaderSql } from './reads/is-crew-leader.sql';
import { ListInvitationsSql } from './reads/list-invitations.sql';
import type { CrewParticipationRequest } from '../../application/models/crew-requests.models';
import { CrewRequestsQueries } from '../../application/ports/crew-requests.queries';
import { FindCrewPrivacySql } from './reads/find-crew-privacy.sql';
/** PostgreSQL implementation of crew participation-request persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresCrewRequestsQueries implements CrewRequestsQueries {
  public constructor(
    private readonly listInvitationsSql: ListInvitationsSql,
    private readonly isCrewLeaderSql: IsCrewLeaderSql,
    private readonly listPendingJoinRequestsSql: ListPendingJoinRequestsSql,
    private readonly findCrewPrivacySql: FindCrewPrivacySql,
  ) {}
  public findCrewPrivacy(crewId: string): Promise<'public' | 'private' | undefined> {
    return this.findCrewPrivacySql.findCrewPrivacy(crewId);
  }
  public listInvitations(): Promise<CrewParticipationRequest[]> {
    return this.listInvitationsSql.listInvitations();
  }
  public isCrewLeader(crewId: string): Promise<boolean> {
    return this.isCrewLeaderSql.isCrewLeader(crewId);
  }
  public listPending(crewId: string): Promise<CrewParticipationRequest[]> {
    return this.listPendingJoinRequestsSql.listPendingJoinRequests(crewId);
  }
}
