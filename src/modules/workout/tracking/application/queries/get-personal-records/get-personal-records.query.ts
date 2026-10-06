import { Query, type IQuery } from '@nestjs/cqrs';

import type { PersonalRecords } from '../../models/workout-tracking.models';
export class GetPersonalRecordsQuery extends Query<{ payload: PersonalRecords; cacheHit: boolean }> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly fromCache = true,
    public readonly timezone: string,
  ) {
    super();
  }
}
