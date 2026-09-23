/** Comment enriched with public author details. */ export type PostComment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorFullName: string;
  authorProfilePicPath: string | null;
  authorUsername: string;
};
/** Cursor-paginated comment collection. */ export type CommentsPage = { comments: PostComment[]; nextCursor: string | null };
/** Outcome of adding a comment to a visible post. */
export type AddCommentOutcome = { kind: 'added' } | { kind: 'post-not-found' };
/** Outcome of editing a comment visible to its owner. */
export type EditCommentOutcome = { kind: 'updated' } | { kind: 'not-found' };
/** Outcome of deleting a comment visible to its owner. */
export type DeleteCommentOutcome = { kind: 'deleted' } | { kind: 'not-found' };
