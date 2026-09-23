/** Post item with author information and engagement totals. */
export type VisiblePost = {
  id: string;
  authorUserId: string;
  workoutSummaryId: string | null;
  content: string;
  visibility: 'crews_only' | 'public';
  publishedAt: string;
  updatedAt: string;
  username: string;
  fullName: string;
  profilePicPath: string | null;
  interactions: { reactionsCount: { likesCount: number; fireUpCount: number; muscleCount: number }; commentsCount: number };
};
/** Cursor-paginated post collection. */ export type PostsPage = { posts: VisiblePost[]; nextCursor: string | null };
/** Input used to create a social post. */ export type CreatePostInput = {
  content: string;
  visibility: 'crews_only' | 'public';
  crewIds: string[];
  workoutSummaryId?: string | null | undefined;
};
/** Outcome of updating a post visible to its owner. */
export type UpdatePostOutcome = { kind: 'updated' } | { kind: 'not-found' };
/** Outcome of deleting a post visible to its owner. */
export type DeletePostOutcome = { kind: 'deleted' } | { kind: 'not-found' };
