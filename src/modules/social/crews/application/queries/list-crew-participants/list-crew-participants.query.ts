import { Query, type IQuery } from '@nestjs/cqrs';

import type { CrewParticipantsPage } from '../../models/crews.models';
export class ListCrewParticipantsQuery extends Query<CrewParticipantsPage> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly crewId: string,
    public readonly limit: number,
    public readonly cursor?: string,
  ) {
    super();
  }
}
