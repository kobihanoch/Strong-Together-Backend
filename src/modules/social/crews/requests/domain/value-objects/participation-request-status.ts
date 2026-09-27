/** Final decision allowed for a pending crew participation request. */
export class ParticipationRequestStatus {
  public readonly value: 'accepted' | 'declined';

  public constructor(value: string) {
    if (value !== 'accepted' && value !== 'declined') throw new Error('Participation request status must be accepted or declined');
    this.value = value;
  }
}
