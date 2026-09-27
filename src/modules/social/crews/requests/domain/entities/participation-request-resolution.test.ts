import { describe, expect, it } from 'vitest';
import { ParticipationRequestResolution } from './participation-request-resolution';

describe('ParticipationRequestResolution', () => {
  it('accepts final request decisions', () => {
    expect(new ParticipationRequestResolution('accepted').status.value).toBe('accepted');
    expect(new ParticipationRequestResolution('declined').status.value).toBe('declined');
  });

  it('rejects unsupported request states', () => {
    expect(() => new ParticipationRequestResolution('pending')).toThrow('Participation request status must be accepted or declined');
  });
});
