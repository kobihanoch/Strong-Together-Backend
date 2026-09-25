import { Injectable } from '@nestjs/common';
import { GetSql } from './reads/get.sql';
import type { SocialSummary } from '../../application/models/social-summary.models';
import { SocialSummaryQueries } from '../../application/ports/social-summary.queries';

/** PostgreSQL implementation of social-summary persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresSocialSummaryQueries implements SocialSummaryQueries {
  public constructor(private readonly getSql: GetSql) {}
  public async get(): Promise<SocialSummary> {
    const [summary] = await this.getSql.get();
    return summary;
  }
}
