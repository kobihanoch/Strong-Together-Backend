import { ParticipationRequestStatus } from '../value-objects/participation-request-status';

/** Validated decision applied to a pending crew participation request. */
export class ParticipationRequestResolution {
  public readonly status: ParticipationRequestStatus;

  public constructor(status: string) {
    this.status = new ParticipationRequestStatus(status);
  }
}
