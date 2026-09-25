import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { CrewInput } from '../models/crews.models';
import { CrewsRepository } from '../ports/crews.repository';

/** Creates a crew led by its creator. */
@Injectable()
export class CreateCrewUseCase {
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
  public async execute(userId: string, input: CrewInput): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.create(userId, input);
    });
  }
}
