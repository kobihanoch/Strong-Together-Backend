import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';
import { ParticipationRequest } from '../../domain/entities/participation-request';

/** Invites a user to a crew. */

@Injectable()
export class InviteCrewUserUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param initiatorUserId - Initiator identifier.
   * @param participantUserId - Invitee identifier.
   * @returns Nothing after creation.
   * @throws {CrewNotFoundError} When the crew is inaccessible.
   */
  public async execute(crewId: string, initiatorUserId: string, participantUserId: string): Promise<void> {
    return this.unitOfWork.execute(initiatorUserId, async () => {
      const invitation = ParticipationRequest.invite(crewId, initiatorUserId, participantUserId);
      if (!(await this.repository.create(invitation))) throw new CrewNotFoundError();
    });
  }
}
