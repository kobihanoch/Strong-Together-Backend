import type { Crew as CrewEntity } from '../../domain/entities/crew';
import type { CrewParticipant } from '../../domain/entities/crew-participant';

/** Persistence operations required by crew use cases. */
export abstract class CrewsRepository {
  public abstract create(crew: CrewEntity): Promise<CrewEntity>;
  public abstract getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined>;
  public abstract updateProfilePicture(crewId: string, path: string | null): Promise<void>;
  public abstract findByIdForUpdate(crewId: string): Promise<CrewEntity | undefined>;
  public abstract findActiveParticipantsForUpdate(crewId: string): Promise<CrewParticipant[]>;
  public abstract save(crew: CrewEntity): Promise<boolean>;
  public abstract saveParticipants(participants: CrewParticipant[]): Promise<void>;
  public abstract delete(id: string): Promise<boolean>;
}
