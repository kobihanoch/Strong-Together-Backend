import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewRequestAccessDeniedError } from '../errors/crew-requests.errors';
import type { PendingCrewJoinRequests } from '../models/crew-requests.models';
import { CrewRequestsRepository } from '../ports/crew-requests.repository';

/** Lists pending join requests for a managed crew. */

@Injectable()
export class ListPendingCrewJoinRequestsUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @returns Pending requests.
   * @throws {CrewRequestAccessDeniedError} When the caller is not its leader.
   */
  public async execute(userId: string, crewId: string): Promise<PendingCrewJoinRequests> {
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.isCrewLeader(crewId))) throw new CrewRequestAccessDeniedError();
      return { requests: await this.repository.listPending(crewId) };
    });
  }
}
