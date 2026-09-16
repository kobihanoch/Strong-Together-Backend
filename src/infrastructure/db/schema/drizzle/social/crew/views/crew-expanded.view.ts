import { sql as drizzleSql } from 'drizzle-orm';
import { integer, jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { socialSchema } from '../../../schemas';
import { crewPrivacy } from '../table';

export type CrewParticipantPreview = {
  username: string;
  fullName: string;
  profilePicPath: string | null;
};

/** Security-invoker projection of an RLS-visible crew with its participant summary. */
export const crewExpandedView = socialSchema
  .view('v_crew_expanded', {
    id: uuid('id'),
    name: text('name'),
    createdBy: uuid('created_by'),
    privacy: crewPrivacy('privacy'),
    createdAt: timestamp('created_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    participantCount: integer('participant_count'),
    top5Participants: jsonb('top_5_participants').$type<CrewParticipantPreview[]>(),
  })
  .with({ securityInvoker: true })
  .as(drizzleSql /*sql*/ `
    SELECT
      c.id,
      c.name,
      c.created_by,
      c.privacy,
      c.created_at,
      c.updated_at,
      social.get_active_crew_participant_count (c.id) AS participant_count,
      social.get_top_crew_participants (c.id) AS top_5_participants
    FROM
      social.crew c
  `);
