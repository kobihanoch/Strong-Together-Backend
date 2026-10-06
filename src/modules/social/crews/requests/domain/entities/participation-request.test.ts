import { describe, expect, it } from 'vitest';
import { ParticipationRequest } from './participation-request';

describe('ParticipationRequest', () => {
  it('creates invitations and join requests as pending', () => {
    expect(ParticipationRequest.invite('crew', 'leader', 'invitee').status).toBe('pending');
    expect(ParticipationRequest.requestToJoin('crew', 'applicant').status).toBe('pending');
  });

  it('allows only public join requests to proceed immediately', () => {
    const request = ParticipationRequest.requestToJoin('crew', 'applicant');
    expect(request.canJoinImmediately('public')).toBe(true);
    expect(request.canJoinImmediately('private')).toBe(false);
    expect(ParticipationRequest.invite('crew', 'leader', 'invitee').canJoinImmediately('public')).toBe(false);
  });

  it('allows a pending request to be accepted or declined only once', () => {
    const accepted = ParticipationRequest.requestToJoin('crew', 'applicant');
    expect(accepted.accept()).toBeUndefined();
    expect(accepted.status).toBe('accepted');
    expect(() => accepted.decline()).toThrow('Participation request is not pending');

    const declined = ParticipationRequest.invite('crew', 'leader', 'invitee');
    expect(declined.decline()).toBeUndefined();
    expect(declined.status).toBe('declined');
    expect(() => declined.accept()).toThrow('Participation request is not pending');
  });
});
