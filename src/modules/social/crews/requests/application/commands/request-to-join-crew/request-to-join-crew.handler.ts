import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../../errors/crew-requests.errors';
import { CrewRequestsRepository } from '../../ports/crew-requests.repository';
import { CrewRequestsQueries } from '../../ports/crew-requests.queries';
import { ParticipationRequest } from '../../../domain/entities/participation-request';
import { RequestToJoinCrewCommand } from './request-to-join-crew.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Requests membership in a crew. */

@CommandHandler(RequestToJoinCrewCommand)
export class RequestToJoinCrewHandler implements ICommandHandler<RequestToJoinCrewCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewRequestsRepository,
    private readonly queries: CrewRequestsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param userId - Requesting user.
   * @returns Nothing after processing.
   * @throws {CrewNotFoundError} When the crew is inaccessible.
   */
  public async execute(command: RequestToJoinCrewCommand): Promise<void> {
    const { crewId, userId } = command;
    return this.unitOfWork.execute(userId, async () => {
      const crewPrivacy = await this.queries.findCrewPrivacy(crewId);
      if (!crewPrivacy) throw new CrewNotFoundError();

      const request = await this.repository.create(ParticipationRequest.requestToJoin(crewId, userId));
      if (!request) throw new CrewNotFoundError();

      if (request.canJoinImmediately(crewPrivacy)) {
        request.accept();
        if (!(await this.repository.save(request))) throw new CrewNotFoundError();
      }
    });
  }
}
