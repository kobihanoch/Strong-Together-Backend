import { Injectable } from '@nestjs/common';
import type { CrewParticipationRequest } from '../application/models/crew-requests.models';
import { CrewRequestsRepository } from '../application/ports/crew-requests.repository';
import { CrewRequestsSql } from './crew-requests.sql';
/** PostgreSQL implementation of crew participation-request persistence. */
@Injectable()
export class PostgresCrewRequestsRepository implements CrewRequestsRepository {
  public constructor(private readonly sql: CrewRequestsSql) {}
  public listInvitations(): Promise<CrewParticipationRequest[]> {
    return this.sql.listInvitations();
  }
  public isCrewLeader(crewId: string): Promise<boolean> {
    return this.sql.isCrewLeader(crewId);
  }
  public listPending(crewId: string): Promise<CrewParticipationRequest[]> {
    return this.sql.listPendingJoinRequests(crewId);
  }
  public async invite(crewId: string, initiatorUserId: string, participantUserId: string): Promise<CrewParticipationRequest | null> {
    return (await this.sql.inviteUser(crewId, initiatorUserId, participantUserId))[0] ?? null;
  }
  public async requestToJoin(crewId: string, userId: string): Promise<CrewParticipationRequest | null> {
    return (await this.sql.requestToJoin(crewId, userId))[0] ?? null;
  }
  public async updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<CrewParticipationRequest | null> {
    return (await this.sql.updateStatus(requestId, status))[0] ?? null;
  }
  public createMembership(crewId: string, userId: string): Promise<void> {
    return this.sql.createMembership(crewId, userId);
  }
}
