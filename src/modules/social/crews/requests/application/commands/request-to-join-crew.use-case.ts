import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';
import { CrewRequestsQueries } from '../ports/crew-requests.queries';
import { ParticipationRequest } from '../../domain/entities/participation-request';

/** Requests membership in a crew. */

@Injectable()
export class RequestToJoinCrewUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
    private readonly queries: CrewRequestsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param userId - Requesting user.
   * @returns Nothing after processing.
   * @throws {CrewNotFoundError} When the crew is inaccessible.
   */
  public async execute(crewId: string, userId: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const crewPrivacy = await this.queries.findCrewPrivacy(crewId);
      if (!crewPrivacy) throw new CrewNotFoundError();

      const request = await this.repository.create(ParticipationRequest.requestToJoin(crewId, userId));
      if (!request) throw new CrewNotFoundError();

      if (request.canJoinImmediately(crewPrivacy)) {
        request.accept();
        if (!(await this.repository.save(request))) throw new CrewNotFoundError();
      }
    });
  }
}
