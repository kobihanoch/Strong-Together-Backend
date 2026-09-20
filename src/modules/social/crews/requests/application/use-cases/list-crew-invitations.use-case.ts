import { Injectable } from '@nestjs/common';
import type { CrewInvitations } from '../models/crew-requests.models';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';

/** Lists invitations addressed to the caller. */ @Injectable()
export class ListCrewInvitationsUseCase {
  public constructor(private readonly repository: CrewRequestsRepository) {}
  /**
   * @returns All visible invitations.
   */
  public async execute(): Promise<CrewInvitations> {
    return { invitations: await this.repository.listInvitations() };
  }
}
