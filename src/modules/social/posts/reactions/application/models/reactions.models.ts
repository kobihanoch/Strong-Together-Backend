/** Reaction attached to a social post. */ export type PostReaction = {
  id: string;
  postId: string;
  userId: string;
  type: 'like' | 'fire up' | 'muscle';
  reactedAt: string;
};
/** Cursor-paginated reaction collection. */ export type ReactionsPage = { reactions: PostReaction[]; nextCursor: string | null };
