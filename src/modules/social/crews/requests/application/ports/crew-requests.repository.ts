import type { ParticipationRequest } from '../../domain/entities/participation-request';
/** Persistence operations required by crew participation workflows. */
export abstract class CrewRequestsRepository {
  public abstract create(request: ParticipationRequest): Promise<ParticipationRequest | undefined>;
  public abstract findByIdForUpdate(requestId: string): Promise<ParticipationRequest | undefined>;
  public abstract save(request: ParticipationRequest): Promise<boolean>;
}
