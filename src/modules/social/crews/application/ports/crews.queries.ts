import type { CrewParticipant, CrewWithParticipantCount, DiscoverableCrew } from '../models/crews.models';

/** Read operations required by application queries. */
export abstract class CrewsQueries {
  public abstract list(limit: number, cursor?: { timestamp: string; id: string }, search?: string): Promise<DiscoverableCrew[]>;
  public abstract listMine(limit: number, cursor?: { timestamp: string; id: string }): Promise<DiscoverableCrew[]>;
  public abstract listParticipants(
    crewId: string,
    limit: number,
    cursor?: { timestamp: string; id: string; rank: number | undefined },
  ): Promise<CrewParticipant[]>;
  public abstract findById(id: string): Promise<CrewWithParticipantCount | null>;
}
