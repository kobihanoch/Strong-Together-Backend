import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { ParticipationRequestNotFoundError } from '../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';

/** Resolves a pending crew participation request. */

@Injectable()
export class UpdateCrewParticipationRequestUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param requestId - Request identifier.
   * @param status - Accepted or declined outcome.
   * @returns Nothing after resolution.
   * @throws {ParticipationRequestNotFoundError} When no pending request is accessible.
   */
  public async execute(userId: string, requestId: string, status: 'accepted' | 'declined'): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.updateStatus(requestId, status);
      if (outcome.kind === 'not-found') throw new ParticipationRequestNotFoundError();
      if (outcome.request.status === 'accepted') await this.repository.createMembership(outcome.request.crewId, outcome.request.participantUserId);
    });
  }
}
