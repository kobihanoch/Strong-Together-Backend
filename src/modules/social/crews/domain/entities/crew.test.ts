import { describe, expect, it } from 'vitest';
import { CrewParticipant, type CrewParticipantValues } from './crew-participant';
import { Crew } from './crew';

const participant = (values: Partial<CrewParticipantValues> = {}) =>
  new CrewParticipant({
    membershipId: 'membership-1',
    userId: 'user-1',
    role: 'member',
    status: 'active',
    joinedAt: '2026-01-01T00:00:00.000Z',
    ...values,
  });

describe('Crew', () => {
  it('marks a regular participant as left', () => {
    const crew = Crew.restore({ id: 'crew', createdBy: 'leader', name: 'Crew', privacy: 'public' });
    const member = participant();
    expect(crew.leave(member.userId, [member])).toEqual([member]);
    expect(member.status).toBe('left');
    expect(member.role).toBe('member');
  });

  it('dissolves the crew when its sole leader leaves', () => {
    const crew = Crew.restore({ id: 'crew', createdBy: 'leader', name: 'Crew', privacy: 'public' });
    expect(crew.leave('leader', [participant({ userId: 'leader', role: 'leader' })])).toEqual([]);
    expect(crew.isDissolved).toBe(true);
  });

  it('promotes the earliest admin before ending the leader membership', () => {
    const crew = Crew.restore({ id: 'crew', createdBy: 'leader', name: 'Crew', privacy: 'public' });
    const leader = participant({ userId: 'leader', role: 'leader' });
    const member = participant({ membershipId: 'member', userId: 'member', joinedAt: '2025-01-01T00:00:00.000Z' });
    const admin = participant({ membershipId: 'admin', userId: 'admin', role: 'admin' });

    expect(crew.leave('leader', [leader, member, admin])).toEqual([admin, leader]);
    expect(admin.role).toBe('leader');
    expect(leader.status).toBe('left');
  });

  it('returns nothing when the user has no active membership', () => {
    expect(() => Crew.restore({ id: 'crew', createdBy: 'leader', name: 'Crew', privacy: 'public' }).leave('missing', [])).toThrow(
      'Active crew membership not found',
    );
  });
});
