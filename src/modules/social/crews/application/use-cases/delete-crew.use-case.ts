import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../errors/crews.errors';
import { CrewsRepository } from '../ports/crews.repository';

/** Deletes a manageable crew. */
@Injectable()
export class DeleteCrewUseCase {
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
  public async execute(userId: string, id: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.delete(id);
      if (outcome.kind === 'not-found') throw new CrewNotFoundError();
    });
  }
}
