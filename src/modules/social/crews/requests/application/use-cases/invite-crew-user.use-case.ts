import { Injectable } from '@nestjs/common';
import { CrewNotFoundError } from '../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';

/** Invites a user to a crew. */ @Injectable()
export class InviteCrewUserUseCase {
  public constructor(private readonly repository: CrewRequestsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param crewId - Crew identifier.
   * @param initiatorUserId - Initiator identifier.
   * @param participantUserId - Invitee identifier.
   * @returns Nothing after creation.
   * @throws {CrewNotFoundError} When the crew is inaccessible.
   */
  public async execute(crewId: string, initiatorUserId: string, participantUserId: string): Promise<void> {
    if (!(await this.repository.invite(crewId, initiatorUserId, participantUserId))) throw new CrewNotFoundError();
  }
}
