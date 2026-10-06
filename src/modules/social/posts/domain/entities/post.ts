import { PostContent } from '../value-objects/post-content';
import { PostVisibility } from '../value-objects/post-visibility';
import { DuplicatePostCrewTargetsError, PostCrewTargetsRequiredError, TooManyPostCrewTargetsError } from '../errors/posts.errors';

/** Values used to create or restore a social post entity. */
export interface PostValues {
  id?: string;
  authorUserId: string;
  content: string;
  visibility: 'crews_only' | 'public';
  crewIds: string[];
  workoutSummaryId?: string | null | undefined;
}

/** Social post entity governing creation invariants and content changes. */
export class Post {
  public readonly id: string | undefined;
  public readonly authorUserId: string;
  public content: PostContent;
  public readonly visibility: PostVisibility;
  public readonly crewIds: string[];
  public readonly workoutSummaryId: string | null | undefined;

  private constructor(values: PostValues) {
    if (values.crewIds.length > 100) throw new TooManyPostCrewTargetsError();
    if (new Set(values.crewIds).size !== values.crewIds.length) throw new DuplicatePostCrewTargetsError();
    if (values.visibility === 'crews_only' && values.crewIds.length === 0) {
      throw new PostCrewTargetsRequiredError();
    }

    this.id = values.id;
    this.authorUserId = values.authorUserId;
    this.content = new PostContent(values.content);
    this.visibility = new PostVisibility(values.visibility);
    this.crewIds = [...values.crewIds];
    this.workoutSummaryId = values.workoutSummaryId;
  }

  public static create(authorUserId: string, values: Omit<PostValues, 'id' | 'authorUserId'>): Post {
    return new Post({ ...values, authorUserId });
  }

  public static restore(values: PostValues & { id: string }): Post {
    return new Post(values);
  }

  /** Replaces editable post content. */
  public edit(content: string): void {
    this.content = new PostContent(content);
  }
}
