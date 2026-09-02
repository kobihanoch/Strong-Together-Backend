import { relations } from 'drizzle-orm';
import { foreignKey, primaryKey, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { identitySchema } from '../../schemas';
import { user } from '../user/table';
import { oauthAccountPolicies } from './policies';
export const oauthAccount = identitySchema.table(
  'oauth_account',
  {
    id: uuid('id').defaultRandom().notNull(),
    userId: uuid('user_id').notNull(),
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    providerEmail: text('provider_email').notNull(),
    linkedAt: timestamp('linked_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ name: 'oauth_account_pkey', columns: [t.id] }),
    unique('oauth_account_provider_user_unique').on(t.provider, t.providerUserId),
    foreignKey({ name: 'oauth_account_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    ...oauthAccountPolicies(t),
  ],
);
export const oauthAccountRelations = relations(oauthAccount, ({ one }) => ({
  user: one(user, { fields: [oauthAccount.userId], references: [user.id] }),
}));
