import { PostContent } from '../value-objects/post-content';
import { PostVisibility } from '../value-objects/post-visibility';

/** Primitive values used to construct a social post draft. */
export interface SocialPostDraftValues {
  content: string;
  visibility: 'crews_only' | 'public';
  crewIds: string[];
  workoutSummaryId?: string | null | undefined;
}

/** Complete social post submitted for creation. */
export class SocialPostDraft {
  public readonly content: PostContent;
  public readonly visibility: PostVisibility;
  public readonly crewIds: string[];
  public readonly workoutSummaryId: string | null | undefined;

  public constructor(values: SocialPostDraftValues) {
    if (values.crewIds.length > 100) throw new Error('A post cannot target more than 100 crews');
    if (new Set(values.crewIds).size !== values.crewIds.length) throw new Error('Crew IDs must be unique');
    if (values.visibility === 'crews_only' && values.crewIds.length === 0) {
      throw new Error('Crew-only posts require at least one crew');
    }

    this.content = new PostContent(values.content);
    this.visibility = new PostVisibility(values.visibility);
    this.crewIds = [...values.crewIds];
    this.workoutSummaryId = values.workoutSummaryId;
  }
}
