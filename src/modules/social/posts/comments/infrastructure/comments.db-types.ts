import { comment } from '../../../../../infrastructure/db/schema/drizzle/social/comment/table';

type CommentDbRow = typeof comment.$inferSelect;

/** Serialized comment row enriched with its author's public profile. */
export type CommentSqlRow = Omit<CommentDbRow, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  authorFullName: string;
  authorProfilePicPath: string | null;
  authorUsername: string;
};

export type CommentWriteSqlRow = Pick<CommentDbRow, 'id'>;
