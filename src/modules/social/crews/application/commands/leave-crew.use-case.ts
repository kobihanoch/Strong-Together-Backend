import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { ActiveCrewMembershipNotFoundError } from '../errors/crews.errors';
import { CrewsRepository } from '../ports/crews.repository';

/** Leaves an active crew membership, preserving leadership rules. */
@Injectable()
export class LeaveCrewUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @returns Nothing after leaving.
   * @throws {ActiveCrewMembershipNotFoundError} When no active membership exists.
   */
  public async execute(userId: string, crewId: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.leave(crewId);
      if (outcome.kind === 'not-member') throw new ActiveCrewMembershipNotFoundError();
    });
  }
}
