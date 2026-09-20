import { Injectable } from '@nestjs/common';
import type { Crew, CrewParticipant, CrewWithParticipantCount, DiscoverableCrew } from '../application/models/crews.models';
import { CrewsRepository } from '../application/ports/crews.repository';
import { CrewsSql } from './crews.sql';

/** PostgreSQL implementation of crew persistence. */
@Injectable()
export class PostgresCrewsRepository implements CrewsRepository {
  public constructor(private readonly sql: CrewsSql) {}
  public list(limit: number, cursor?: { timestamp: string; id: string }, search?: string): Promise<DiscoverableCrew[]> {
    return this.sql.queryCrews(limit, cursor, search);
  }
  public listMine(limit: number, cursor?: { timestamp: string; id: string }): Promise<DiscoverableCrew[]> {
    return this.sql.queryMyCrews(limit, cursor);
  }
  public listParticipants(
    crewId: string,
    limit: number,
    cursor?: { timestamp: string; id: string; rank: number | undefined },
  ): Promise<CrewParticipant[]> {
    return this.sql.queryCrewParticipants(crewId, limit, cursor);
  }
  public async findById(id: string): Promise<CrewWithParticipantCount | null> {
    return (await this.sql.queryCrew(id))[0] ?? null;
  }
  public async create(userId: string, input: { name: string; privacy: 'public' | 'private' }): Promise<Crew> {
    return (await this.sql.queryCreateCrew(userId, input.name, input.privacy))[0];
  }
  public async update(id: string, input: { name: string; privacy: 'public' | 'private' }): Promise<boolean> {
    return (await this.sql.queryUpdateCrew(id, input.name, input.privacy)).length > 0;
  }
  public async getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined> {
    return (await this.sql.queryCrewProfilePictureForUpdate(crewId))[0]?.profilePicPath;
  }
  public async updateProfilePicture(crewId: string, path: string | null): Promise<void> {
    await this.sql.queryUpdateCrewProfilePicture(crewId, path);
  }
  public async leave(crewId: string): Promise<'left' | 'not_member'> {
    return (await this.sql.queryLeaveCrew(crewId))[0]?.result ?? 'not_member';
  }
  public async delete(id: string): Promise<boolean> {
    return (await this.sql.queryDeleteCrew(id)).length > 0;
  }
}
