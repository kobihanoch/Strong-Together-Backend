import { Injectable } from '@nestjs/common';
import type {
  Crew,
  CrewParticipant,
  CrewWithParticipantCount,
  DeleteCrewOutcome,
  DiscoverableCrew,
  LeaveCrewOutcome,
  UpdateCrewOutcome,
} from '../application/models/crews.models';
import { CrewsRepository } from '../application/ports/crews.repository';
import { CrewsSql } from './crews.sql';

/** PostgreSQL implementation of crew persistence. */
@Injectable()
export class PostgresCrewsRepository implements CrewsRepository {
  public constructor(private readonly sql: CrewsSql) {}
  public list(limit: number, cursor?: { timestamp: string; id: string }, search?: string): Promise<DiscoverableCrew[]> {
    return this.sql.list(limit, cursor, search);
  }
  public listMine(limit: number, cursor?: { timestamp: string; id: string }): Promise<DiscoverableCrew[]> {
    return this.sql.listMine(limit, cursor);
  }
  public listParticipants(
    crewId: string,
    limit: number,
    cursor?: { timestamp: string; id: string; rank: number | undefined },
  ): Promise<CrewParticipant[]> {
    return this.sql.listParticipants(crewId, limit, cursor);
  }
  public async findById(id: string): Promise<CrewWithParticipantCount | null> {
    return (await this.sql.findById(id))[0] ?? null;
  }
  public async create(userId: string, input: { name: string; privacy: 'public' | 'private' }): Promise<Crew> {
    return (await this.sql.create(userId, input.name, input.privacy))[0];
  }
  public async update(id: string, input: { name: string; privacy: 'public' | 'private' }): Promise<UpdateCrewOutcome> {
    return (await this.sql.update(id, input.name, input.privacy)).length > 0 ? { kind: 'updated' } : { kind: 'not-found' };
  }
  public async getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined> {
    return (await this.sql.findProfilePictureForUpdate(crewId))[0]?.profilePicPath;
  }
  public async updateProfilePicture(crewId: string, path: string | null): Promise<void> {
    await this.sql.updateProfilePicture(crewId, path);
  }
  public async leave(crewId: string): Promise<LeaveCrewOutcome> {
    const outcome = (await this.sql.leave(crewId))[0];
    if (!outcome || outcome.result === 'not_member') return { kind: 'not-member' };
    if (outcome.result === 'crew_deleted') return { kind: 'crew-deleted' };
    if (outcome.result === 'leadership_transferred') {
      return { kind: 'leadership-transferred', successorId: outcome.successorId! };
    }
    return { kind: 'member-left' };
  }
  public async delete(id: string): Promise<DeleteCrewOutcome> {
    return (await this.sql.delete(id)).length > 0 ? { kind: 'deleted' } : { kind: 'not-found' };
  }
}
