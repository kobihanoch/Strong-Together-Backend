import type { SocialSummary } from '../models/social-summary.models';

/** Persistence capability required to retrieve a social summary. */
export abstract class SocialSummaryRepository {
  public abstract get(): Promise<SocialSummary>;
}
