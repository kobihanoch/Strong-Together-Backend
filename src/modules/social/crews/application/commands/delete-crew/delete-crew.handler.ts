import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../../errors/crews.errors';
import { CrewsRepository } from '../../ports/crews.repository';
import { DeleteCrewCommand } from './delete-crew.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Deletes a manageable crew. */
@CommandHandler(DeleteCrewCommand)
export class DeleteCrewHandler implements ICommandHandler<DeleteCrewCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Crew identifier.
   * @returns Nothing after deletion.
   * @throws {CrewNotFoundError} When inaccessible or absent.
   */
  public async execute(command: DeleteCrewCommand): Promise<void> {
    const { userId, id } = command;
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.delete(id))) throw new CrewNotFoundError();
    });
  }
}
