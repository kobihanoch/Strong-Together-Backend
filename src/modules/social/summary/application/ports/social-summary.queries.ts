import type { SocialSummary } from '../models/social-summary.models';

/** Read operations required by application queries. */
export abstract class SocialSummaryQueries {
  public abstract get(): Promise<SocialSummary>;
}
