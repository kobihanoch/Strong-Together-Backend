import type { Crew, DeleteCrewOutcome, LeaveCrewOutcome, UpdateCrewOutcome } from '../models/crews.models';

/** Persistence operations required by crew use cases. */
export abstract class CrewsRepository {
  public abstract create(userId: string, input: { name: string; privacy: 'public' | 'private' }): Promise<Crew>;
  public abstract update(id: string, input: { name: string; privacy: 'public' | 'private' }): Promise<UpdateCrewOutcome>;
  public abstract getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined>;
  public abstract updateProfilePicture(crewId: string, path: string | null): Promise<void>;
  public abstract leave(crewId: string): Promise<LeaveCrewOutcome>;
  public abstract delete(id: string): Promise<DeleteCrewOutcome>;
}
