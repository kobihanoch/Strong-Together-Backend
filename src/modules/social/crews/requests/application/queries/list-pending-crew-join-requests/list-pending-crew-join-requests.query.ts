import { Query, type IQuery } from '@nestjs/cqrs';

import type { PendingCrewJoinRequests } from '../../models/crew-requests.models';
export class ListPendingCrewJoinRequestsQuery extends Query<PendingCrewJoinRequests> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly crewId: string,
  ) {
    super();
  }
}
