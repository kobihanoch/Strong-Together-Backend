import { Query, type IQuery } from '@nestjs/cqrs';

import type { CrewWithParticipantCount } from '../../models/crews.models';
export class GetCrewQuery extends Query<CrewWithParticipantCount> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {
    super();
  }
}
