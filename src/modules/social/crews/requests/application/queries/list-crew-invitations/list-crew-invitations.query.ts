import { Query, type IQuery } from '@nestjs/cqrs';

import type { CrewInvitations } from '../../models/crew-requests.models';
export class ListCrewInvitationsQuery extends Query<CrewInvitations> implements IQuery {
  public constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
