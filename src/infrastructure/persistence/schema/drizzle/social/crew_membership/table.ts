import { relations } from 'drizzle-orm';
import { foreignKey, index, primaryKey, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { socialSchema } from '../../schemas';
import { crew } from '../crew/table';
import { crewMembershipPolicies } from './policies';

export const crewMembershipStatus = socialSchema.enum('Crew Membership Status', ['active', 'left', 'removed', 'banned']);
export const crewMembershipRole = socialSchema.enum('Crew Membership Role', ['leader', 'admin', 'member']);
export const crewMembership = socialSchema
  .table(
    'crew_membership',
    {
      id: uuid('id').defaultRandom().notNull(),
      crewId: uuid('crew_id').notNull(),
      userId: uuid('user_id').notNull(),
      status: crewMembershipStatus('status').notNull().default('active'),
      role: crewMembershipRole('role').notNull().default('member'),
      joinedAt: timestamp('joined_at', { withTimezone: true }).notNull(),
      createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
      updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'crew_membership_pkey', columns: [t.id] }),
      foreignKey({ name: 'crew_membership_crew_id_fkey', columns: [t.crewId], foreignColumns: [crew.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({ name: 'crew_membership_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      unique('crew_membership_crew_user_unique').on(t.crewId, t.userId),
      index('crew_membership_user_id_idx').on(t.userId),
      index('crew_membership_crew_status_idx').on(t.crewId, t.status),
      ...crewMembershipPolicies(t),
    ],
  )
  .enableRLS();

export const crewMembershipRelations = relations(crewMembership, ({ one }) => ({
  crew: one(crew, { fields: [crewMembership.crewId], references: [crew.id] }),
  user: one(user, { fields: [crewMembership.userId], references: [user.id] }),
}));
