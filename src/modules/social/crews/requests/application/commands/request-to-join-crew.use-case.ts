import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';

/** Requests membership in a crew. */

@Injectable()
export class RequestToJoinCrewUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
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
      const outcome = await this.repository.requestToJoin(crewId, userId);
      if (outcome.kind === 'crew-not-found') throw new CrewNotFoundError();
      if (outcome.request.status === 'accepted') await this.repository.createMembership(outcome.request.crewId, outcome.request.participantUserId);
    });
  }
}
