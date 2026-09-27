import { CrewParticipant } from './crew-participant';
import { CrewName } from '../value-objects/crew-name';
import { CrewPrivacy } from '../value-objects/crew-privacy';
import { ActiveCrewMembershipMissingError } from '../errors/crews.errors';

/** Values available when creating a crew. */
export type CreateCrewValues = { createdBy: string; name: string; privacy: 'public' | 'private' };
/** Values used to restore a persisted crew. */
export type RestoreCrewValues = CreateCrewValues & { id: string };

/** Crew aggregate governing membership departure and leadership continuity. */
export class Crew {
  private dissolved = false;
  private detailsChanged = false;
  public readonly id: string | undefined;
  public readonly createdBy: string;
  private currentName: CrewName;
  private currentPrivacy: CrewPrivacy;

  private constructor(id: string | undefined, values: CreateCrewValues) {
    this.id = id;
    this.createdBy = values.createdBy;
    this.currentName = new CrewName(values.name);
    this.currentPrivacy = new CrewPrivacy(values.privacy);
  }

  public static create(values: CreateCrewValues): Crew {
    return new Crew(undefined, values);
  }

  public static restore(values: RestoreCrewValues): Crew {
    return new Crew(values.id, values);
  }

  public get name(): CrewName {
    return this.currentName;
  }

  public get privacy(): CrewPrivacy {
    return this.currentPrivacy;
  }

  public get hasDetailChanges(): boolean {
    return this.detailsChanged;
  }

  public get isDissolved(): boolean {
    return this.dissolved;
  }

  /** Replaces editable crew details after validating their domain values. */
  public updateDetails(values: { name: string; privacy: 'public' | 'private' }): void {
    this.currentName = new CrewName(values.name);
    this.currentPrivacy = new CrewPrivacy(values.privacy);
    this.detailsChanged = true;
  }

  /**
   * Applies a participant departure and identifies the changed membership entities.
   */
  public leave(userId: string, participants: CrewParticipant[]) {
    const departing = participants.find((participant) => participant.userId === userId && participant.isActive());
    if (!departing) throw new ActiveCrewMembershipMissingError();

    if (!departing.isLeader()) {
      departing.leave();
      return [departing];
    }

    const successor = participants.filter((participant) => participant.userId !== userId && participant.isActive()).sort(Crew.compareSuccessors)[0];

    if (!successor) {
      this.dissolved = true;
      return [];
    }

    successor.promoteToLeader();
    departing.leave();
    return [successor, departing];
  }

  private static compareSuccessors(left: CrewParticipant, right: CrewParticipant): number {
    const rolePriority = { leader: 0, admin: 1, member: 2 } as const;
    return (
      rolePriority[left.role] - rolePriority[right.role] ||
      left.joinedAt.localeCompare(right.joinedAt) ||
      left.membershipId.localeCompare(right.membershipId)
    );
  }
}
