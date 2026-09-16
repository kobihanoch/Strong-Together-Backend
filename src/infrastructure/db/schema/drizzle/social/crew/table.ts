import { relations } from 'drizzle-orm';
import { foreignKey, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { socialSchema } from '../../schemas';
import { crewPolicies } from './policies';

export const crewPrivacy = socialSchema.enum('Crew Privacy', ['public', 'private']);
export const crew = socialSchema
  .table(
    'crew',
    {
      id: uuid('id').defaultRandom().notNull(),
      name: text('name').notNull(),
      createdBy: uuid('created_by').notNull(),
      privacy: crewPrivacy('privacy').notNull(),
      profilePicPath: text('profile_pic_path'),
      createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
      updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'crew_pkey', columns: [t.id] }),
      foreignKey({ name: 'crew_created_by_fkey', columns: [t.createdBy], foreignColumns: [user.id] }).onUpdate('cascade'),
      ...crewPolicies(t),
    ],
  )

  .enableRLS();

export const crewRelations = relations(crew, ({ one }) => ({
  creator: one(user, { fields: [crew.createdBy], references: [user.id] }),
}));
