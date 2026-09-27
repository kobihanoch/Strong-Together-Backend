import { CommentContent } from '../value-objects/comment-content';

/** New comment content submitted for a visible social post. */
export class PostCommentDraft {
  public readonly content: CommentContent;

  public constructor(content: string) {
    this.content = new CommentContent(content);
  }
}
