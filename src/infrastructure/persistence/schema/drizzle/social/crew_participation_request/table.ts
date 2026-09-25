import { sql as drizzleSql, relations } from 'drizzle-orm';
import { foreignKey, index, primaryKey, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { socialSchema } from '../../schemas';
import { crew } from '../crew/table';
import { crewParticipationRequestPolicies } from './policies';

export const crewParticipationRequestStatus = socialSchema.enum('Crew Participation Request Status', [
  'pending',
  'accepted',
  'declined',
  'cancelled',
  'expired',
]);
export const crewParticipationRequest = socialSchema
  .table(
    'crew_participation_request',
    {
      id: uuid('id').defaultRandom().notNull(),
      crewId: uuid('crew_id').notNull(),
      initiatorUserId: uuid('initiator_user_id').notNull(),
      participantUserId: uuid('participant_user_id').notNull(),
      status: crewParticipationRequestStatus('status').notNull().default('pending'),
      createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
      updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
      respondedAt: timestamp('responded_at', { withTimezone: true }),
    },
    (t) => [
      primaryKey({ name: 'crew_participation_request_pkey', columns: [t.id] }),
      foreignKey({ name: 'crew_participation_request_crew_id_fkey', columns: [t.crewId], foreignColumns: [crew.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({ name: 'crew_participation_request_initiator_fkey', columns: [t.initiatorUserId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({ name: 'crew_participation_request_participant_fkey', columns: [t.participantUserId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      uniqueIndex('crew_participation_request_pending_participant_unique')
        .on(t.crewId, t.participantUserId)
        .where(drizzleSql`${t.status} = 'pending'`),
      index('crew_participation_request_crew_id_idx').on(t.crewId),
      index('crew_participation_request_participant_idx').on(t.participantUserId),
      ...crewParticipationRequestPolicies(t),
    ],
  )
  .enableRLS();

export const crewParticipationRequestRelations = relations(crewParticipationRequest, ({ one }) => ({
  crew: one(crew, { fields: [crewParticipationRequest.crewId], references: [crew.id] }),
  initiator: one(user, { fields: [crewParticipationRequest.initiatorUserId], references: [user.id], relationName: 'crewRequestInitiator' }),
  participant: one(user, { fields: [crewParticipationRequest.participantUserId], references: [user.id], relationName: 'crewRequestParticipant' }),
}));
