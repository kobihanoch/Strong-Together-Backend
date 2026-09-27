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
      const crew = await this.repository.findByIdForUpdate(crewId);
      if (!crew) throw new ActiveCrewMembershipNotFoundError();

      const participants = await this.repository.findActiveParticipantsForUpdate(crewId);
      const changedParticipants = crew.leave(userId, participants);
      if (!(await this.repository.save(crew))) throw new ActiveCrewMembershipNotFoundError();
      await this.repository.saveParticipants(changedParticipants);
    });
  }
}
