import { reaction } from '../../../../../../infrastructure/persistence/schema/drizzle/social/reaction/table';

/** Represents the reaction db row value. */
type ReactionDbRow = typeof reaction.$inferSelect;

/** Reaction enum inferred from the PostgreSQL schema. */
export type ReactionDbType = ReactionDbRow['type'];
/** Serialized reaction row returned by raw SQL. */
export type ReactionSqlRow = Omit<ReactionDbRow, 'reactedAt'> & { reactedAt: string };
/** Represents the reaction write sql row value. */
export type ReactionWriteSqlRow = Pick<ReactionDbRow, 'id'>;
