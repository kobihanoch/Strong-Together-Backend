import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateCrewBody, CrewQueryDto, ListCrewParticipantsResponse, ListCrewsResponse, UpdateCrewBody } from '@strong-together/shared';
import { CrewsQueries } from './crews.queries';
/** Coordinates crew CRUD operations and maps empty query results to HTTP errors. */
@Injectable()
export class CrewsService {
  constructor(private readonly queries: CrewsQueries) {}
  /**
   * Lists discoverable crews with a limited participant preview.
   *
   * @param limit - The maximum number of crews to return.
   * @param offset - The number of crews to skip.
   * @returns A contract object containing the visible crews.
   */
  async listCrewsData(limit: number, offset: number): Promise<ListCrewsResponse> {
    return { crews: await this.queries.queryCrews(limit, offset) };
  }

  /**
   * Lists active participants when the crew is public or the caller belongs to it.
   *
   * @param crewId - The UUID of the crew whose participants are requested.
   * @param userId - The authenticated caller's UUID.
   * @param limit - The maximum number of participants to return.
   * @param offset - The number of participants to skip.
   * @returns A contract object containing the authorized participant rows.
   */
  async listCrewParticipantsData(crewId: string, userId: string, limit: number, offset: number): Promise<ListCrewParticipantsResponse> {
    const participants = await this.queries.queryCrewParticipants(crewId, userId, limit, offset);
    return { participants };
  }
  /**
   * Gets one visible crew.
   *
   * @param id - The crew UUID.
   * @returns The matching crew.
   * @throws NotFoundException when the query returns no visible crew.
   */
  async getCrewData(id: string): Promise<CrewQueryDto> {
    const [row] = await this.queries.queryCrew(id);
    if (!row) throw new NotFoundException('Crew not found');
    return row;
  }
  /**
   * Creates a crew and assigns its creator as the leader.
   *
   * @param userId - The authenticated creator's UUID.
   * @param body - The validated crew creation data.
   * @returns A promise that resolves after creation.
   */
  async createCrewData(userId: string, body: CreateCrewBody): Promise<void> {
    await this.queries.queryCreateCrew(userId, body.privacy);
  }
  /**
   * Updates a crew through the caller's RLS transaction.
   *
   * @param id - The crew UUID.
   * @param body - The validated crew update data.
   * @returns A promise that resolves after the update.
   * @throws NotFoundException when no permitted crew is updated.
   */
  async updateCrewData(id: string, userId: string, body: UpdateCrewBody): Promise<void> {
    const [row] = await this.queries.queryUpdateCrew(id, userId, body.privacy);
    if (!row) throw new NotFoundException('Crew not found');
  }
  /**
   * Deletes a crew through the caller's RLS transaction.
   *
   * @param id - The crew UUID.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when no permitted crew is deleted.
   */
  async deleteCrewData(id: string, userId: string): Promise<void> {
    if (!(await this.queries.queryDeleteCrew(id, userId)).length) throw new NotFoundException('Crew not found');
  }
}
