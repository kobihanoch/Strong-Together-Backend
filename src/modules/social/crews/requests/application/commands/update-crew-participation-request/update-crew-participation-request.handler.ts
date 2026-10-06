import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { ParticipationRequestNotFoundError } from '../../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../../ports/crew-requests.repository';
import { UpdateCrewParticipationRequestCommand } from './update-crew-participation-request.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Resolves a pending crew participation request. */

@CommandHandler(UpdateCrewParticipationRequestCommand)
export class UpdateCrewParticipationRequestHandler implements ICommandHandler<UpdateCrewParticipationRequestCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param requestId - Request identifier.
   * @param status - Accepted or declined outcome.
   * @returns Nothing after resolution.
   * @throws {ParticipationRequestNotFoundError} When no pending request is accessible.
   */
  public async execute(command: UpdateCrewParticipationRequestCommand): Promise<void> {
    const { userId, requestId, status } = command;
    return this.unitOfWork.execute(userId, async () => {
      const request = await this.repository.findByIdForUpdate(requestId);
      if (!request) throw new ParticipationRequestNotFoundError();

      if (status === 'accepted') request.accept();
      else request.decline();
      if (!(await this.repository.save(request))) throw new ParticipationRequestNotFoundError();
    });
  }
}
