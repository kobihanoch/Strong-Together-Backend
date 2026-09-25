import { post } from '../../../../../infrastructure/persistence/schema/drizzle/social/post/table';
import { postExpandedView } from '../../../../../infrastructure/persistence/schema/drizzle/social/post/views/post-expanded.view';

/** Represents the post db row value. */
type PostDbRow = typeof post.$inferSelect;
/** Represents the post expanded db row value. */
type PostExpandedDbRow = typeof postExpandedView.$inferSelect;

/** Represents the required post expanded db row value. */
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

/** Represents the deleted post sql row value. */
export type DeletedPostSqlRow = Pick<PostDbRow, 'id'>;
