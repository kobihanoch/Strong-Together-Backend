import { Injectable } from '@nestjs/common';
import { CrewNotFoundError } from '../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';

/** Requests membership in a crew. */ @Injectable()
export class RequestToJoinCrewUseCase {
  public constructor(private readonly repository: CrewRequestsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param crewId - Crew identifier.
   * @param userId - Requesting user.
   * @returns Nothing after processing.
   * @throws {CrewNotFoundError} When the crew is inaccessible.
   */
  public async execute(crewId: string, userId: string): Promise<void> {
    const request = await this.repository.requestToJoin(crewId, userId);
    if (!request) throw new CrewNotFoundError();
    if (request.status === 'accepted') await this.repository.createMembership(request.crewId, request.participantUserId);
  }
}
