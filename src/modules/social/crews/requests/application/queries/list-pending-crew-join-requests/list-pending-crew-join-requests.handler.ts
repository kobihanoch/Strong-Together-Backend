import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { CrewRequestAccessDeniedError } from '../../errors/crew-requests.errors';
import type { PendingCrewJoinRequests } from '../../models/crew-requests.models';
import { CrewRequestsQueries } from '../../ports/crew-requests.queries';
import { ListPendingCrewJoinRequestsQuery } from './list-pending-crew-join-requests.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Lists pending join requests for a managed crew. */

@QueryHandler(ListPendingCrewJoinRequestsQuery)
export class ListPendingCrewJoinRequestsHandler implements IQueryHandler<ListPendingCrewJoinRequestsQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: CrewRequestsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @returns Pending requests.
   * @throws {CrewRequestAccessDeniedError} When the caller is not its leader.
   */
  public async execute(query: ListPendingCrewJoinRequestsQuery): Promise<PendingCrewJoinRequests> {
    const { userId, crewId } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      if (!(await this.query.isCrewLeader(crewId))) throw new CrewRequestAccessDeniedError();
      return { requests: await this.query.listPending(crewId) };
    });
  }
}
