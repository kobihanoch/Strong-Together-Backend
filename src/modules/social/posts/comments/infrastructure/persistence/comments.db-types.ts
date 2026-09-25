import { comment } from '../../../../../../infrastructure/db/schema/drizzle/social/comment/table';

/** Represents the comment db row value. */
type CommentDbRow = typeof comment.$inferSelect;

/** Serialized comment row enriched with its author's public profile. */
export type CommentSqlRow = Omit<CommentDbRow, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  authorFullName: string;
  authorProfilePicPath: string | null;
  authorUsername: string;
};

/** Represents the comment write sql row value. */
export type CommentWriteSqlRow = Pick<CommentDbRow, 'id'>;
