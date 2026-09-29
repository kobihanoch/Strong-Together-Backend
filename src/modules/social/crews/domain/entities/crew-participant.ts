import { InactiveCrewParticipantError } from '../errors/crews.errors';

/** Values required to restore a crew participant. */
export type CrewParticipantValues = {
  membershipId: string;
  userId: string;
  role: 'leader' | 'admin' | 'member';
  status: 'active' | 'left' | 'removed' | 'banned';
  joinedAt: string;
};

/** Crew membership entity with controlled role and status transitions. */
export class CrewParticipant {
  public readonly membershipId: string;
  public readonly userId: string;
  public readonly joinedAt: string;
  private currentRole: CrewParticipantValues['role'];
  private currentStatus: CrewParticipantValues['status'];

  public constructor(values: CrewParticipantValues) {
    this.membershipId = values.membershipId;
    this.userId = values.userId;
    this.joinedAt = values.joinedAt;
    this.currentRole = values.role;
    this.currentStatus = values.status;
  }

  public get role(): CrewParticipantValues['role'] {
    return this.currentRole;
  }

  public get status(): CrewParticipantValues['status'] {
    return this.currentStatus;
  }

  public isActive(): boolean {
    return this.currentStatus === 'active';
  }

  public isLeader(): boolean {
    return this.currentRole === 'leader';
  }

  /** Ends this active membership and removes any privileged role. */
  public leave(): void {
    if (!this.isActive()) throw new InactiveCrewParticipantError();
    this.currentStatus = 'left';
    this.currentRole = 'member';
  }

  /** Promotes an active participant to crew leader. */
  public promoteToLeader(): void {
    if (!this.isActive()) throw new InactiveCrewParticipantError();
    this.currentRole = 'leader';
  }
}
