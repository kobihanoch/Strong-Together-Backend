import type { Crew, CrewParticipant, CrewWithParticipantCount, DiscoverableCrew } from '../models/crews.models';

/** Persistence operations required by crew use cases. */
export abstract class CrewsRepository {
  public abstract list(limit: number, cursor?: { timestamp: string; id: string }, search?: string): Promise<DiscoverableCrew[]>;
  public abstract listMine(limit: number, cursor?: { timestamp: string; id: string }): Promise<DiscoverableCrew[]>;
  public abstract listParticipants(
    crewId: string,
    limit: number,
    cursor?: { timestamp: string; id: string; rank: number | undefined },
  ): Promise<CrewParticipant[]>;
  public abstract findById(id: string): Promise<CrewWithParticipantCount | null>;
  public abstract create(userId: string, input: { name: string; privacy: 'public' | 'private' }): Promise<Crew>;
  public abstract update(id: string, input: { name: string; privacy: 'public' | 'private' }): Promise<boolean>;
  public abstract getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined>;
  public abstract updateProfilePicture(crewId: string, path: string | null): Promise<void>;
  public abstract leave(crewId: string): Promise<'left' | 'not_member'>;
  public abstract delete(id: string): Promise<boolean>;
}
