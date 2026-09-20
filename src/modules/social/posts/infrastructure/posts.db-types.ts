import { post } from '../../../../infrastructure/db/schema/drizzle/social/post/table';
import { postExpandedView } from '../../../../infrastructure/db/schema/drizzle/social/post/views/post-expanded.view';

type PostDbRow = typeof post.$inferSelect;
type PostExpandedDbRow = typeof postExpandedView.$inferSelect;

type RequiredPostExpandedDbRow = {
  [Key in keyof PostExpandedDbRow]-?: Key extends 'workoutSummaryId' | 'profilePicPath'
    ? PostExpandedDbRow[Key]
    : NonNullable<PostExpandedDbRow[Key]>;
};

/** Serialized expanded post row returned by raw SQL. */
export type PostSqlRow = Omit<RequiredPostExpandedDbRow, 'publishedAt' | 'updatedAt'> & {
  publishedAt: string;
  updatedAt: string;
};

/** Serialized post write result. */
export type PostWriteSqlRow = Omit<PostDbRow, 'publishedAt' | 'updatedAt'> & {
  publishedAt: string;
  updatedAt: string;
};

export type DeletedPostSqlRow = Pick<PostDbRow, 'id'>;
