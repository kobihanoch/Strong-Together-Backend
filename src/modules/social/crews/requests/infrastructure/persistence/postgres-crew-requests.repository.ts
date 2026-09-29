import { Injectable } from '@nestjs/common';
import { SaveSql } from './writes/save.sql';
import { CreateParticipationRequestSql } from './writes/create.sql';
import { FindParticipationRequestByIdForUpdateSql } from './reads/find-by-id-for-update.sql';
import { CrewRequestsRepository } from '../../application/ports/crew-requests.repository';
import { ParticipationRequest } from '../../domain/entities/participation-request';
/** PostgreSQL implementation of crew participation-request persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresCrewRequestsRepository implements CrewRequestsRepository {
  public constructor(
    private readonly createSql: CreateParticipationRequestSql,
    private readonly findByIdForUpdateSql: FindParticipationRequestByIdForUpdateSql,
    private readonly saveSql: SaveSql,
  ) {}
  public async create(request: ParticipationRequest): Promise<ParticipationRequest | undefined> {
    const created = await this.createSql.create(request);
    return created ? ParticipationRequest.restore(created) : undefined;
  }
  public async findByIdForUpdate(requestId: string): Promise<ParticipationRequest | undefined> {
    const request = await this.findByIdForUpdateSql.findByIdForUpdate(requestId);
    return request ? ParticipationRequest.restore(request) : undefined;
  }
  public save(request: ParticipationRequest): Promise<boolean> {
    return this.saveSql.save(request);
  }
}
