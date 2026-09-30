import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import type { CrewInvitations } from '../../models/crew-requests.models';
import { CrewRequestsQueries } from '../../ports/crew-requests.queries';
import { ListCrewInvitationsQuery } from './list-crew-invitations.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Lists invitations addressed to the caller. */

@QueryHandler(ListCrewInvitationsQuery)
export class ListCrewInvitationsHandler implements IQueryHandler<ListCrewInvitationsQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: CrewRequestsQueries,
  ) {}
  /**
   * @returns All visible invitations.
   */
  public async execute(query: ListCrewInvitationsQuery): Promise<CrewInvitations> {
    const { userId } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      return { invitations: await this.query.listInvitations() };
    });
  }
}
