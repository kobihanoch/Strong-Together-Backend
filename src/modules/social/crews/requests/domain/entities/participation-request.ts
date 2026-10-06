import { ParticipationRequestNotPendingError } from '../errors/participation-request.errors';

/** Persisted states in the crew participation-request lifecycle. */
export type ParticipationRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired';

/** Values used to rehydrate an existing participation request. */
export type ParticipationRequestValues = {
  id?: string;
  crewId: string;
  initiatorUserId: string;
  participantUserId: string;
  status?: ParticipationRequestStatus;
};

/** Aggregate governing invitation and join-request lifecycle transitions. */
export class ParticipationRequest {
  public readonly id: string | undefined;
  public readonly crewId: string;
  public readonly initiatorUserId: string;
  public readonly participantUserId: string;
  private currentStatus: ParticipationRequestStatus;

  private constructor(values: ParticipationRequestValues) {
    this.id = values.id;
    this.crewId = values.crewId;
    this.initiatorUserId = values.initiatorUserId;
    this.participantUserId = values.participantUserId;
    this.currentStatus = values.status ?? 'pending';
  }

  /** Creates a pending invitation initiated by a crew leader. */
  public static invite(crewId: string, initiatorUserId: string, participantUserId: string): ParticipationRequest {
    return new ParticipationRequest({ crewId, initiatorUserId, participantUserId });
  }

  /** Creates a pending request initiated by the prospective participant. */
  public static requestToJoin(crewId: string, userId: string): ParticipationRequest {
    return new ParticipationRequest({ crewId, initiatorUserId: userId, participantUserId: userId });
  }

  /** Restores a request loaded from persistence. */
  public static restore(values: ParticipationRequestValues): ParticipationRequest {
    return new ParticipationRequest(values);
  }

  public get status(): ParticipationRequestStatus {
    return this.currentStatus;
  }

  /** Identifies invitations without storing a separate, potentially inconsistent type field. */
  public get isInvitation(): boolean {
    return this.initiatorUserId !== this.participantUserId;
  }

  /** Public join requests can proceed immediately; private requests require approval. */
  public canJoinImmediately(crewPrivacy: 'public' | 'private'): boolean {
    return !this.isInvitation && crewPrivacy === 'public';
  }

  /** Accepts a pending request. */
  public accept(): void {
    if (this.currentStatus !== 'pending') throw new ParticipationRequestNotPendingError();
    this.currentStatus = 'accepted';
  }

  /** Declines a pending request. */
  public decline(): void {
    if (this.currentStatus !== 'pending') throw new ParticipationRequestNotPendingError();
    this.currentStatus = 'declined';
  }
}
