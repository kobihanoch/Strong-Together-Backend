import { Injectable } from '@nestjs/common';
import type { GetSocialSummaryResponse } from '@strong-together/shared';
import { SocialSummaryQueries } from './social-summary.queries';

/** Builds the authenticated user's compact social summary. */
@Injectable()
export class SocialSummaryService {
  public constructor(private readonly queries: SocialSummaryQueries) {}

  /**
   * Retrieves the caller's active crew count and participant previews.
   *
   * @returns The caller's social summary.
   */
  public async getSummary(): Promise<GetSocialSummaryResponse> {
    const [summary] = await this.queries.querySocialSummary();
    return summary;
  }
}
