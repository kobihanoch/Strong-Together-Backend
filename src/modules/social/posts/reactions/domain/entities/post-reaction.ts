import { ReactionType } from '../value-objects/reaction-type';

/** A user's validated reaction to a social post, identified by post and user. */
export class PostReaction {
  public readonly postId: string;
  public readonly userId: string;
  public readonly type: ReactionType;

  private constructor(postId: string, userId: string, type: string) {
    this.postId = postId;
    this.userId = userId;
    this.type = new ReactionType(type);
  }

  public static create(postId: string, userId: string, type: string): PostReaction {
    return new PostReaction(postId, userId, type);
  }
}
