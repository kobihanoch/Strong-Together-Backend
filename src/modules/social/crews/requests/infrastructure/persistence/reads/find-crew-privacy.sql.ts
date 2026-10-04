import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';

/** Reads the privacy policy that controls how a new join request proceeds. */
@Injectable()
export class FindCrewPrivacySql {
  public constructor(private readonly dbService: DBService) {}

  /** Returns the visible crew's privacy, or nothing when the crew is inaccessible. */
  public async findCrewPrivacy(crewId: string): Promise<'public' | 'private' | undefined> {
    const [crew] = await this.dbService.sql<Array<{ privacy: 'public' | 'private' }>>`
      SELECT
        privacy
      FROM
        social.crew
      WHERE
        id = ${crewId}::UUID
    `;
    return crew?.privacy;
  }
}
