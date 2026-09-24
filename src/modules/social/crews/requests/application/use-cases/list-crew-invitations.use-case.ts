import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { CrewInvitations } from '../models/crew-requests.models';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';

/** Lists invitations addressed to the caller. */

@Injectable()
export class ListCrewInvitationsUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
  ) {}
  /**
   * @returns All visible invitations.
   */
  public async execute(userId: string): Promise<CrewInvitations> {
    return this.unitOfWork.execute(userId, async () => {
      return { invitations: await this.repository.listInvitations() };
    });
  }
}
