import { ReactionType } from '../value-objects/reaction-type';

/** Validated reaction selected for a social post. */
export class PostReactionSelection {
  public readonly type: ReactionType;

  public constructor(type: string) {
    this.type = new ReactionType(type);
  }
}
