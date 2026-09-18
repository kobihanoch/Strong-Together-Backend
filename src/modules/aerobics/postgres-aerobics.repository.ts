import { Injectable } from '@nestjs/common';
import type { AddAerobicInputQueryDto, UserAerobicsQueryDto } from '@strong-together/shared';
import { AerobicsQueries } from './aerobics.queries';
import { AerobicsRepository } from './aerobics.repository';

@Injectable()
export class PostgresAerobicsRepository implements AerobicsRepository {
  constructor(private readonly queries: AerobicsQueries) {}

  findAerobicsByUser(userId: string, days: number, timezone: string): Promise<UserAerobicsQueryDto> {
    return this.queries.queryGetUserAerobicsForNDays(userId, days, timezone);
  }

  createAerobicForUser(userId: string, record: AddAerobicInputQueryDto): Promise<void> {
    return this.queries.queryAddAerobicTracking(userId, record);
  }

  updateAerobicForUser(userId: string, id: number, record: AddAerobicInputQueryDto): Promise<number | null> {
    return this.queries.queryUpdateAerobicTracking(userId, id, record);
  }

  deleteAerobicForUser(userId: string, id: number): Promise<number | null> {
    return this.queries.queryDeleteAerobicTracking(userId, id);
  }
}
