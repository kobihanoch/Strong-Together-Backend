import { Injectable } from '@nestjs/common';
import type { SocialSummary } from '../models/social-summary.models';
import { SocialSummaryRepository } from '../ports/social-summary.repository';

/** Retrieves the authenticated user's compact social overview. */
@Injectable()
export class GetSocialSummaryUseCase {
  public constructor(private readonly repository: SocialSummaryRepository) {}

  /**
   * Retrieves the active crew count and unique participant previews.
   *
   * @returns The current user's social summary.
   */
  public execute(): Promise<SocialSummary> {
    return this.repository.get();
  }
}
