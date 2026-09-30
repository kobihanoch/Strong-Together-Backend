import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewsRepository } from '../../ports/crews.repository';
import { Crew } from '../../../domain/entities/crew';
import { CreateCrewCommand } from './create-crew.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Creates a crew led by its creator. */
@CommandHandler(CreateCrewCommand)
export class CreateCrewHandler implements ICommandHandler<CreateCrewCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param userId - Creator identifier.
   * @param input - Crew properties.
   * @returns Nothing after creation.
   */
  public async execute(command: CreateCrewCommand): Promise<void> {
    const { userId, input } = command;
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.create(Crew.create({ createdBy: userId, ...input }));
    });
  }
}
