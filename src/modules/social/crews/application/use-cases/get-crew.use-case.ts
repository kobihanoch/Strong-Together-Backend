import { Injectable } from '@nestjs/common';
import { CrewNotFoundError } from '../errors/crews.errors';
import type { CrewWithParticipantCount } from '../models/crews.models';
import { CrewsRepository } from '../ports/crews.repository';

/** Retrieves one visible crew. */
@Injectable()
export class GetCrewUseCase {
  public constructor(private readonly repository: CrewsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param id - Crew identifier.
   * @returns The visible crew.
   * @throws {CrewNotFoundError} When inaccessible or absent. */
  public async execute(id: string): Promise<CrewWithParticipantCount> {
    const crew = await this.repository.findById(id);
    if (!crew) throw new CrewNotFoundError();
    return crew;
  }
}
