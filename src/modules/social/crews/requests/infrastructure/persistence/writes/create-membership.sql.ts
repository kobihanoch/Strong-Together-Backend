import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';

/**
 * Executes crew participation-request persistence operations inside the current
 * request's RLS transaction.
 *
 * @remarks
 * These queries intentionally rely on PostgreSQL row-level security for access
 * control. Select methods return only visible rows, while mutation methods return
 * an empty collection when the target is missing or inaccessible.
 */

@Injectable()
export class CreateMembershipSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Creates active member membership for a specific crew participant.
   *
   * @param crewId - The UUID of the crew the participant is joining.
   * @param userId - The UUID of the user receiving active member membership.
   * @returns A promise that resolves after membership insertion.
   */
  async createMembership(crewId: string, userId: string): Promise<void> {
    await this.dbService.sql`
      INSERT INTO
        social.crew_membership (crew_id, user_id, status, role, joined_at)
      VALUES
        (
          ${crewId}::UUID,
          ${userId}::UUID,
          'active',
          'member',
          NOW()
        )
    `;
  }
}
