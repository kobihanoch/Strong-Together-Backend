import { Inject, Injectable } from '@nestjs/common';
import type { GetSocialSummaryResponse } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

/** Reads the authenticated user's compact social overview inside the current RLS transaction. */
@Injectable()
export class SocialSummaryQueries {
  public constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Counts active crew memberships and selects three unique active co-members.
   *
   * @returns One social-summary row for the authenticated user.
   */
  public querySocialSummary(): Promise<GetSocialSummaryResponse[]> {
    return this.sql<GetSocialSummaryResponse[]>`
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
