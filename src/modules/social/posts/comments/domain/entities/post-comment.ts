import { CommentContent } from '../value-objects/comment-content';

/** Post comment entity governing creation and content changes. */
export class PostComment {
  public readonly id: string | undefined;
  public readonly postId: string;
  public readonly authorUserId: string;
  public content: CommentContent;

  private constructor(id: string | undefined, postId: string, authorUserId: string, content: string) {
    this.id = id;
    this.postId = postId;
    this.authorUserId = authorUserId;
    this.content = new CommentContent(content);
  }

  public static create(postId: string, authorUserId: string, content: string): PostComment {
    return new PostComment(undefined, postId, authorUserId, content);
  }

  public static restore(values: { id: string; postId: string; authorUserId: string; content: string }): PostComment {
    return new PostComment(values.id, values.postId, values.authorUserId, values.content);
  }

  public edit(content: string): void {
    this.content = new CommentContent(content);
  }
}
