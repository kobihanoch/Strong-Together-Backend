import { relations } from 'drizzle-orm';
import { foreignKey, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { socialSchema } from '../../schemas';
import { crewPolicies } from './policies';

export const crewPrivacy = socialSchema.enum('Crew Privacy', ['public', 'private']);
export const crew = socialSchema
  .table(
    'crew',
    {
      id: uuid('id').defaultRandom().notNull(),
      leaderId: uuid('leader_id').notNull(),
      privacy: crewPrivacy('privacy').notNull(),
      createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
      updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'crew_pkey', columns: [t.id] }),
      foreignKey({ name: 'crew_leader_id_fkey', columns: [t.leaderId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      ...crewPolicies(t),
    ],
  )

  .enableRLS();

export const crewRelations = relations(crew, ({ one }) => ({
  leader: one(user, { fields: [crew.leaderId], references: [user.id] }),
}));
