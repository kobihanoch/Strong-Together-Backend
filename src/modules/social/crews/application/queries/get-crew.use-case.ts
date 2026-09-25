import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../errors/crews.errors';
import type { CrewWithParticipantCount } from '../models/crews.models';
import { CrewsQueries } from '../ports/crews.queries';

/** Retrieves one visible crew. */
@Injectable()
export class GetCrewUseCase {
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
  public async execute(userId: string, id: string): Promise<CrewWithParticipantCount> {
    return this.unitOfWork.execute(userId, async () => {
      const crew = await this.query.findById(id);
      if (!crew) throw new CrewNotFoundError();
      return crew;
    });
  }
}
