import { relations, sql as drizzleSql } from 'drizzle-orm';
import { foreignKey, primaryKey, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { identitySchema } from '../../schemas';
import { users } from '../users/table';
import { oauthAccountsPolicies } from './policies';
export const oauthAccounts = identitySchema.table(
  'oauth_accounts',
  {
    id: uuid('id').defaultRandom().notNull(),
    userId: uuid('user_id').notNull(),
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    providerEmail: text('provider_email').notNull(),
    linkedAt: timestamp('linked_at', { withTimezone: true })
      .default(drizzleSql`now() AT TIME ZONE 'utc'`)
      .notNull(),
    missingFields: text('missing_fields'),
  },
  (t) => [
    primaryKey({ name: 'oauth_accounts_pkey', columns: [t.id] }),
    unique('oauth_accounts_provider_user_unique').on(t.provider, t.providerUserId),
    foreignKey({ name: 'oauth_accounts_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    ...oauthAccountsPolicies(t),
  ],
);
export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, { fields: [oauthAccounts.userId], references: [users.id] }),
}));
