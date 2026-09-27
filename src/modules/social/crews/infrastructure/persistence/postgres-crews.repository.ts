import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import { SaveParticipantsSql } from './writes/save-participants.sql';
import { FindCrewByIdForUpdateSql } from './reads/find-by-id-for-update.sql';
import { FindActiveParticipantsForUpdateSql } from './reads/find-active-participants-for-update.sql';
import { UpdateProfilePictureSql } from './writes/update-profile-picture.sql';
import { FindProfilePictureForUpdateSql } from './reads/find-profile-picture-for-update.sql';
import { CreateSql } from './writes/create.sql';
import { CrewsRepository } from '../../application/ports/crews.repository';
import { Crew as CrewEntity } from '../../domain/entities/crew';
import { CrewParticipant } from '../../domain/entities/crew-participant';

/** PostgreSQL implementation of crew persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresCrewsRepository implements CrewsRepository {
  public constructor(
    private readonly createSql: CreateSql,
    private readonly findProfilePictureForUpdateSql: FindProfilePictureForUpdateSql,
    private readonly updateProfilePictureSql: UpdateProfilePictureSql,
    private readonly findByIdForUpdateSql: FindCrewByIdForUpdateSql,
    private readonly findActiveParticipantsForUpdateSql: FindActiveParticipantsForUpdateSql,
    private readonly saveSql: SaveSql,
    private readonly saveParticipantsSql: SaveParticipantsSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async create(crew: CrewEntity): Promise<CrewEntity> {
    const created = (await this.createSql.create(crew))[0];
    return CrewEntity.restore(created);
  }
  public async getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined> {
    return (await this.findProfilePictureForUpdateSql.findProfilePictureForUpdate(crewId))[0]?.profilePicPath;
  }
  public async updateProfilePicture(crewId: string, path: string | null): Promise<void> {
    await this.updateProfilePictureSql.updateProfilePicture(crewId, path);
  }
  public async findByIdForUpdate(crewId: string): Promise<CrewEntity | undefined> {
    const crew = await this.findByIdForUpdateSql.findByIdForUpdate(crewId);
    return crew ? CrewEntity.restore(crew) : undefined;
  }
  public async findActiveParticipantsForUpdate(crewId: string): Promise<CrewParticipant[]> {
    return (await this.findActiveParticipantsForUpdateSql.findActiveParticipantsForUpdate(crewId)).map(
      (participant) => new CrewParticipant({ ...participant, status: 'active' }),
    );
  }
  public save(crew: CrewEntity): Promise<boolean> {
    return this.saveSql.save(crew);
  }
  public async saveParticipants(participants: CrewParticipant[]): Promise<void> {
    await this.saveParticipantsSql.saveParticipants(participants);
  }
  public async delete(id: string): Promise<boolean> {
    return this.deleteSql.delete(id);
  }
}
