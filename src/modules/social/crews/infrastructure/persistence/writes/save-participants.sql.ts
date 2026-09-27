import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewParticipant } from '../../../domain/entities/crew-participant';

/** Persists participant state changes in one bulk operation. */
@Injectable()
export class SaveParticipantsSql {
  constructor(private readonly dbService: DBService) {}

  async saveParticipants(participants: CrewParticipant[]): Promise<void> {
    if (participants.length === 0) return;

    const membershipIds = participants.map((participant) => participant.membershipId);
    const statuses = participants.map((participant) => participant.status);
    const roles = participants.map((participant) => participant.role);

    await this.dbService.sql`
      UPDATE social.crew_membership membership
      SET
        status = changes.status::social."Crew Membership Status",
        role = changes.role::social."Crew Membership Role",
        updated_at = NOW()
      FROM
        UNNEST(
          ${membershipIds}::UUID[],
          ${statuses}::TEXT[],
          ${roles}::TEXT[]
        ) AS changes (membership_id, status, role)
      WHERE
        membership.id = changes.membership_id
    `;
  }
}
