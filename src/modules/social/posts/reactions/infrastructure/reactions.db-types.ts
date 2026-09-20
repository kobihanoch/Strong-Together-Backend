import { reaction } from '../../../../../infrastructure/db/schema/drizzle/social/reaction/table';

type ReactionDbRow = typeof reaction.$inferSelect;

/** Serialized reaction row returned by raw SQL. */
export type ReactionSqlRow = Omit<ReactionDbRow, 'reactedAt'> & { reactedAt: string };
export type ReactionWriteSqlRow = Pick<ReactionDbRow, 'id'>;
