import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { Crew } from '../../../domain/entities/crew';

/** Persists the current state of a crew aggregate. */
@Injectable()
export class SaveSql {
  constructor(private readonly dbService: DBService) {}

  async save(crew: Crew): Promise<boolean> {
    if (!crew.id) throw new Error('Cannot save a crew without an ID');
    if (crew.isDissolved) {
      const deleted = await this.dbService.sql`
        DELETE FROM social.crew c
        WHERE
          c.id = ${crew.id}::UUID
        RETURNING
          id
      `;
      return deleted.length > 0;
    }

    if (!crew.hasDetailChanges) return true;
    const updated = await this.dbService.sql`
      UPDATE social.crew
      SET
        name = ${crew.name.value},
        privacy = ${crew.privacy.value}::social."Crew Privacy",
        updated_at = NOW()
      WHERE
        id = ${crew.id}::UUID
      RETURNING
        id
    `;
    return updated.length > 0;
  }
}
