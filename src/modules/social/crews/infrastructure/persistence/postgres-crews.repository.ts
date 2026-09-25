import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { LeaveSql } from './writes/leave.sql';
import { UpdateProfilePictureSql } from './writes/update-profile-picture.sql';
import { FindProfilePictureForUpdateSql } from './reads/find-profile-picture-for-update.sql';
import { UpdateSql } from './writes/update.sql';
import { CreateSql } from './writes/create.sql';
import type { Crew, DeleteCrewOutcome, LeaveCrewOutcome, UpdateCrewOutcome } from '../../application/models/crews.models';
import { CrewsRepository } from '../../application/ports/crews.repository';

/** PostgreSQL implementation of crew persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresCrewsRepository implements CrewsRepository {
  public constructor(
    private readonly createSql: CreateSql,
    private readonly updateSql: UpdateSql,
    private readonly findProfilePictureForUpdateSql: FindProfilePictureForUpdateSql,
    private readonly updateProfilePictureSql: UpdateProfilePictureSql,
    private readonly leaveSql: LeaveSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async create(userId: string, input: { name: string; privacy: 'public' | 'private' }): Promise<Crew> {
    return (await this.createSql.create(userId, input.name, input.privacy))[0];
  }
  public async update(id: string, input: { name: string; privacy: 'public' | 'private' }): Promise<UpdateCrewOutcome> {
    return (await this.updateSql.update(id, input.name, input.privacy)).length > 0 ? { kind: 'updated' } : { kind: 'not-found' };
  }
  public async getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined> {
    return (await this.findProfilePictureForUpdateSql.findProfilePictureForUpdate(crewId))[0]?.profilePicPath;
  }
  public async updateProfilePicture(crewId: string, path: string | null): Promise<void> {
    await this.updateProfilePictureSql.updateProfilePicture(crewId, path);
  }
  public async leave(crewId: string): Promise<LeaveCrewOutcome> {
    const outcome = (await this.leaveSql.leave(crewId))[0];
    if (!outcome || outcome.result === 'not_member') return { kind: 'not-member' };
    if (outcome.result === 'crew_deleted') return { kind: 'crew-deleted' };
    if (outcome.result === 'leadership_transferred') {
      return { kind: 'leadership-transferred', successorId: outcome.successorId! };
    }
    return { kind: 'member-left' };
  }
  public async delete(id: string): Promise<DeleteCrewOutcome> {
    return (await this.deleteSql.delete(id)).length > 0 ? { kind: 'deleted' } : { kind: 'not-found' };
  }
}
