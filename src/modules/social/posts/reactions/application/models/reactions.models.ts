/** Reaction attached to a social post. */
export type PostReaction = {
  id: string;
  postId: string;
  userId: string;
  type: 'like' | 'fire up' | 'muscle';
  reactedAt: string;
};
/** Cursor-paginated reaction collection. */
export type ReactionsPage = { reactions: PostReaction[]; nextCursor: string | null };
/** Outcome of saving a reaction to a visible post. */
export type SaveReactionOutcome = { kind: 'saved' } | { kind: 'post-not-found' };
/** Outcome of deleting a user's reaction. */
export type DeleteReactionOutcome = { kind: 'deleted' } | { kind: 'not-found' };
