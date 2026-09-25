import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { SocialSummarySqlRow } from '../social-summary.db-types';

/** Executes the authenticated social-summary SQL projection. */

@Injectable()
export class GetSql {
  public constructor(private readonly dbService: DBService) {}
  /**
   * Executes the get SQL operation.
   *
   * @returns The query result.
   */
  public get(): Promise<SocialSummarySqlRow[]> {
    return this.dbService.sql<SocialSummarySqlRow[]>`
      SELECT
        (
          SELECT
            COUNT(DISTINCT mine.crew_id)::INTEGER
          FROM
            social.crew_membership mine
          WHERE
            mine.user_id = identity.current_user_id ()
            AND mine.status = 'active'
        ) AS "activeCrewCount",
        COALESCE(
          (
            SELECT
              JSONB_AGG(
                JSONB_BUILD_OBJECT(
                  'userId',
                  preview.user_id,
                  'username',
                  profile.username,
                  'fullName',
                  profile.name,
                  'profilePicPath',
                  profile."profilePicPath"
                )
                ORDER BY
                  preview.latest_joined_at DESC,
                  preview.user_id
              )
            FROM
              (
                SELECT
                  participant.user_id,
                  MAX(participant.joined_at) AS latest_joined_at
                FROM
                  social.crew_membership mine
                  INNER JOIN social.crew_membership participant ON participant.crew_id = mine.crew_id
                WHERE
                  mine.user_id = identity.current_user_id ()
                  AND mine.status = 'active'
                  AND participant.status = 'active'
                  AND participant.user_id <> identity.current_user_id ()
                GROUP BY
                  participant.user_id
                ORDER BY
                  latest_joined_at DESC,
                  participant.user_id
                LIMIT
                  3
              ) preview
              CROSS JOIN LATERAL identity.get_user_profile (preview.user_id) profile
          ),
          '[]'::JSONB
        ) AS "participantPreviews"
    `;
  }
}
