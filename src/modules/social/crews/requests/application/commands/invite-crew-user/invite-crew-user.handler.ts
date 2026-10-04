import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../../ports/crew-requests.repository';
import { ParticipationRequest } from '../../../domain/entities/participation-request';
import { InviteCrewUserCommand } from './invite-crew-user.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Invites a user to a crew. */

@CommandHandler(InviteCrewUserCommand)
export class InviteCrewUserHandler implements ICommandHandler<InviteCrewUserCommand> {
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
  public async execute(command: InviteCrewUserCommand): Promise<void> {
    const { crewId, initiatorUserId, participantUserId } = command;
    return this.unitOfWork.execute(initiatorUserId, async () => {
      const invitation = ParticipationRequest.invite(crewId, initiatorUserId, participantUserId);
      if (!(await this.repository.create(invitation))) throw new CrewNotFoundError();
    });
  }
}
