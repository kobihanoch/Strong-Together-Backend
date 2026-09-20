import { Injectable } from '@nestjs/common';
import type { SocialSummary } from '../application/models/social-summary.models';
import { SocialSummaryRepository } from '../application/ports/social-summary.repository';
import { SocialSummarySql } from './social-summary.sql';

/** PostgreSQL implementation of social-summary persistence. */
@Injectable()
export class PostgresSocialSummaryRepository implements SocialSummaryRepository {
  public constructor(private readonly sql: SocialSummarySql) {}

  public async get(): Promise<SocialSummary> {
    const [summary] = await this.sql.query();
    return summary;
  }
}
