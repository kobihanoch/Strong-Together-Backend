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
