import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { ActiveCrewMembershipNotFoundError } from '../../errors/crews.errors';
import { CrewsRepository } from '../../ports/crews.repository';
import { LeaveCrewCommand } from './leave-crew.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Leaves an active crew membership, preserving leadership rules. */
@CommandHandler(LeaveCrewCommand)
export class LeaveCrewHandler implements ICommandHandler<LeaveCrewCommand> {
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
  public async execute(command: LeaveCrewCommand): Promise<void> {
    const { userId, crewId } = command;
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
