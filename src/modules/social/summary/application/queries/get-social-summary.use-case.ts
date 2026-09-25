import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { SocialSummary } from '../models/social-summary.models';
import { SocialSummaryQueries } from '../ports/social-summary.queries';

/** Retrieves the authenticated user's compact social overview. */
@Injectable()
export class GetSocialSummaryUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: SocialSummaryQueries,
  ) {}

  /**
   * Retrieves the active crew count and unique participant previews.
   *
   * @returns The current user's social summary.
   */
  public execute(userId: string): Promise<SocialSummary> {
    return this.unitOfWork.execute(userId, async () => {
      return this.repository.get();
    });
  }
}
