import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../../errors/crews.errors';
import type { CrewWithParticipantCount } from '../../models/crews.models';
import { CrewsQueries } from '../../ports/crews.queries';
import { GetCrewQuery } from './get-crew.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves one visible crew. */
@QueryHandler(GetCrewQuery)
export class GetCrewHandler implements IQueryHandler<GetCrewQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: CrewsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Crew identifier.
   * @returns The visible crew.
   * @throws {CrewNotFoundError} When inaccessible or absent.
   */
  public async execute(query: GetCrewQuery): Promise<CrewWithParticipantCount> {
    const { userId, id } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const crew = await this.query.findById(id);
      if (!crew) throw new CrewNotFoundError();
      return crew;
    });
  }
}
