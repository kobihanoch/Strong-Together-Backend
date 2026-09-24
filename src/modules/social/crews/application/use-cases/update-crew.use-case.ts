import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { CrewNotFoundError } from '../errors/crews.errors';
import type { CrewInput } from '../models/crews.models';
import { CrewsRepository } from '../ports/crews.repository';

/** Updates a manageable crew. */
@Injectable()
export class UpdateCrewUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Crew identifier.
   * @param input - Replacement properties.
   * @returns Nothing after update.
   * @throws {CrewNotFoundError} When inaccessible or absent.
   */
  public async execute(userId: string, id: string, input: CrewInput): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.update(id, input);
      if (outcome.kind === 'not-found') throw new CrewNotFoundError();
    });
  }
}
