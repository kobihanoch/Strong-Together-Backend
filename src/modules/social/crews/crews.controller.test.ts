import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  getCrewResponseSchema,
  listCrewInvitationsResponseSchema,
  listCrewParticipantsResponseSchema,
  listCrewsResponseSchema,
  listPendingCrewJoinRequestsResponseSchema,
} from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import {
  crewExists,
  getCrewById,
  getCrewByLeaderId,
  getCrewMembership,
  getCrewParticipationRequest,
  getPostByAuthorId,
  getPostByContent,
  insertCrewMembership,
  setCrewMembershipStatus,
} from '../../../common/tests/helpers/db';
import { cleanupTestUsers, createAndLoginTestUser } from '../../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 60000);

afterEach(async () => {
  await cleanupTestUsers(users);
  users.clear();
});

async function crewUser(prefix: string) {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  return user;
}

async function createCrew(accessToken: string, leaderId: string, privacy: 'public' | 'private' = 'public') {
  const response = await request(app.getHttpServer()).post('/api/social/crews').set(authHeaders(accessToken)).send({ name: 'Test Crew', privacy });

  expect(response.status).toBe(201);
  expect(response.text).toBe('');

  const crew = await getCrewByLeaderId(leaderId);
  expect(crew).not.toBeNull();
  return crew!;
}

describe('CrewsController', () => {
  /** Enforces request authorization, listing isolation, terminal transitions, and membership side effects for both request kinds. */
  it('supports public joins and accepting or declining participation requests through RLS', async () => {
    const leader = await crewUser('crew_flow_leader');
    const publicJoiner = await crewUser('crew_flow_public');
    const privateJoiner = await crewUser('crew_flow_private');
    const invitee = await crewUser('crew_flow_invitee');
    const declinedJoiner = await crewUser('crew_flow_declined_join');
    const declinedInvitee = await crewUser('crew_flow_declined_invite');
    const outsider = await crewUser('crew_flow_outsider');
    const publicCrew = await createCrew(leader.accessToken, leader.userId, 'public');
    const privateCrew = await createCrew(leader.accessToken, leader.userId, 'private');

    const publicJoin = await request(app.getHttpServer())
      .post(`/api/social/crews/${publicCrew.id}/join-requests`)
      .set(authHeaders(publicJoiner.accessToken));
    expect(publicJoin.status, JSON.stringify(publicJoin.body)).toBe(201);
    expect(await getCrewMembership(publicCrew.id, publicJoiner.userId)).toMatchObject({ status: 'active', role: 'member' });

    const privateJoin = await request(app.getHttpServer())
      .post(`/api/social/crews/${privateCrew.id}/join-requests`)
      .set(authHeaders(privateJoiner.accessToken));
    expect(privateJoin.status).toBe(201);
    const joinRequest = await getCrewParticipationRequest(privateCrew.id, privateJoiner.userId);
    expect(joinRequest).toMatchObject({ status: 'pending', initiator_user_id: privateJoiner.userId });

    const pendingRequests = await request(app.getHttpServer())
      .get(`/api/social/crews/${privateCrew.id}/join-requests`)
      .set(authHeaders(leader.accessToken));
    expect(pendingRequests.status).toBe(200);
    expectSchema(listPendingCrewJoinRequestsResponseSchema, pendingRequests.body);
    expect(pendingRequests.body.requests).toEqual(expect.arrayContaining([expect.objectContaining({ id: joinRequest!.id, status: 'pending' })]));

    const forbiddenRequests = await request(app.getHttpServer())
      .get(`/api/social/crews/${privateCrew.id}/join-requests`)
      .set(authHeaders(outsider.accessToken));
    expect(forbiddenRequests.status).toBe(403);

    const forbiddenAccept = await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${joinRequest!.id}`)
      .set(authHeaders(outsider.accessToken))
      .send({ status: 'accepted' });
    expect(forbiddenAccept.status).toBe(404);

    const requesterCannotAccept = await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${joinRequest!.id}`)
      .set(authHeaders(privateJoiner.accessToken))
      .send({ status: 'accepted' });
    expect(requesterCannotAccept.status).toBe(404);

    const acceptedJoin = await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${joinRequest!.id}`)
      .set(authHeaders(leader.accessToken))
      .send({ status: 'accepted' });
    expect(acceptedJoin.status).toBe(204);
    expect(await getCrewMembership(privateCrew.id, privateJoiner.userId)).toMatchObject({ status: 'active', role: 'member' });

    const repeatedJoinResolution = await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${joinRequest!.id}`)
      .set(authHeaders(leader.accessToken))
      .send({ status: 'declined' });
    expect(repeatedJoinResolution.status).toBe(404);
    expect(await getCrewParticipationRequest(privateCrew.id, privateJoiner.userId)).toMatchObject({ status: 'accepted' });

    const pendingAfterAcceptance = await request(app.getHttpServer())
      .get(`/api/social/crews/${privateCrew.id}/join-requests`)
      .set(authHeaders(leader.accessToken));
    expect(pendingAfterAcceptance.body.requests).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: joinRequest!.id })]));

    const invitation = await request(app.getHttpServer())
      .post(`/api/social/crews/${privateCrew.id}/invitations`)
      .set(authHeaders(leader.accessToken))
      .send({ userId: invitee.userId });
    expect(invitation.status).toBe(201);
    const inviteRequest = await getCrewParticipationRequest(privateCrew.id, invitee.userId);
    expect(inviteRequest).toMatchObject({ status: 'pending', initiator_user_id: leader.userId });

    const invitations = await request(app.getHttpServer()).get('/api/social/crews/invitations').set(authHeaders(invitee.accessToken));
    expect(invitations.status).toBe(200);
    expectSchema(listCrewInvitationsResponseSchema, invitations.body);
    expect(invitations.body.invitations).toEqual(expect.arrayContaining([expect.objectContaining({ id: inviteRequest!.id, status: 'pending' })]));

    const outsiderInvitations = await request(app.getHttpServer()).get('/api/social/crews/invitations').set(authHeaders(outsider.accessToken));
    expect(outsiderInvitations.status).toBe(200);
    expectSchema(listCrewInvitationsResponseSchema, outsiderInvitations.body);
    expect(outsiderInvitations.body.invitations).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: inviteRequest!.id })]));

    const inviterCannotAccept = await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${inviteRequest!.id}`)
      .set(authHeaders(leader.accessToken))
      .send({ status: 'accepted' });
    expect(inviterCannotAccept.status).toBe(404);

    const acceptedInvitation = await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${inviteRequest!.id}`)
      .set(authHeaders(invitee.accessToken))
      .send({ status: 'accepted' });
    expect(acceptedInvitation.status, JSON.stringify(acceptedInvitation.body)).toBe(204);
    expect(await getCrewMembership(privateCrew.id, invitee.userId)).toMatchObject({ status: 'active', role: 'member' });

    const resolvedInvitations = await request(app.getHttpServer()).get('/api/social/crews/invitations').set(authHeaders(invitee.accessToken));
    expect(resolvedInvitations.body.invitations).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: inviteRequest!.id, status: 'accepted' })]),
    );

    await request(app.getHttpServer())
      .post(`/api/social/crews/${privateCrew.id}/join-requests`)
      .set(authHeaders(declinedJoiner.accessToken))
      .expect(201);
    const declinedJoinRequest = await getCrewParticipationRequest(privateCrew.id, declinedJoiner.userId);
    await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${declinedJoinRequest!.id}`)
      .set(authHeaders(leader.accessToken))
      .send({ status: 'declined' })
      .expect(204);
    expect(await getCrewParticipationRequest(privateCrew.id, declinedJoiner.userId)).toMatchObject({ status: 'declined' });
    expect(await getCrewMembership(privateCrew.id, declinedJoiner.userId)).toBeNull();

    await request(app.getHttpServer())
      .post(`/api/social/crews/${privateCrew.id}/invitations`)
      .set(authHeaders(leader.accessToken))
      .send({ userId: declinedInvitee.userId })
      .expect(201);
    const declinedInvitation = await getCrewParticipationRequest(privateCrew.id, declinedInvitee.userId);
    await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${declinedInvitation!.id}`)
      .set(authHeaders(declinedInvitee.accessToken))
      .send({ status: 'declined' })
      .expect(204);
    expect(await getCrewParticipationRequest(privateCrew.id, declinedInvitee.userId)).toMatchObject({ status: 'declined' });
    expect(await getCrewMembership(privateCrew.id, declinedInvitee.userId)).toBeNull();
  });
  it('POST /api/social/crews creates a crew and returns 201 without a body', async () => {
    const leader = await crewUser('crew_create');
    const crew = await createCrew(leader.accessToken, leader.userId, 'private');

    expect(crew).toMatchObject({ leader_id: leader.userId, privacy: 'private' });
    expect(await crewExists(crew.id)).toBe(true);
  });

  it('GET /api/social/crews returns paginated crews with at most five participant previews', async () => {
    const leader = await crewUser('crew_list_leader');
    const participant = await crewUser('crew_list_member');
    const viewer = await crewUser('crew_list_viewer');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await insertCrewMembership(crew.id, participant.userId);

    const response = await request(app.getHttpServer()).get('/api/social/crews').query({ limit: 1 }).set(authHeaders(viewer.accessToken));

    expect(response.status).toBe(200);
    expectSchema(listCrewsResponseSchema, response.body);
    expect(response.body.crews).toHaveLength(1);
    expect(response.body.crews[0].top5Participants.length).toBeLessThanOrEqual(5);
    expect(response.body.crews[0].top5Participants[0]).toEqual({
      username: leader.username,
      fullName: 'Controller Test User',
      profilePicPath: null,
    });
  });

  it('GET /api/social/crews/:id returns a schema-valid crew', async () => {
    const leader = await crewUser('crew_get');
    const viewer = await crewUser('crew_get_viewer');
    const crew = await createCrew(leader.accessToken, leader.userId, 'private');

    const response = await request(app.getHttpServer()).get(`/api/social/crews/${crew.id}`).set(authHeaders(viewer.accessToken));

    expect(response.status).toBe(200);
    expectSchema(getCrewResponseSchema, response.body);
    expect(response.body).toMatchObject({ id: crew.id, leaderId: leader.userId, privacy: 'private' });
  });

  it('GET /api/social/crews/:crewId/participants exposes public crews and paginates active memberships', async () => {
    const leader = await crewUser('crew_public_leader');
    const participant = await crewUser('crew_public_member');
    const viewer = await crewUser('crew_public_viewer');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await insertCrewMembership(crew.id, participant.userId);

    const firstPage = await request(app.getHttpServer())
      .get(`/api/social/crews/${crew.id}/participants`)
      .query({ limit: 1 })
      .set(authHeaders(viewer.accessToken));
    const secondPage = await request(app.getHttpServer())
      .get(`/api/social/crews/${crew.id}/participants`)
      .query({ limit: 1, cursor: firstPage.body.nextCursor })
      .set(authHeaders(viewer.accessToken));

    expect(firstPage.status).toBe(200);
    expect(secondPage.status).toBe(200);
    expectSchema(listCrewParticipantsResponseSchema, firstPage.body);
    expectSchema(listCrewParticipantsResponseSchema, secondPage.body);
    expect(firstPage.body.participants).toHaveLength(1);
    expect(secondPage.body.participants).toHaveLength(1);
    expect(firstPage.body.nextCursor).toEqual(expect.any(String));
    expect(firstPage.body.participants[0].role).toBe('leader');
    expect(secondPage.body.participants[0].role).toBe('member');
  });

  it('GET participants hides a private crew from outsiders but allows active members', async () => {
    const leader = await crewUser('crew_private_leader');
    const participant = await crewUser('crew_private_member');
    const outsider = await crewUser('crew_private_outsider');
    const crew = await createCrew(leader.accessToken, leader.userId, 'private');
    await insertCrewMembership(crew.id, participant.userId);

    const hidden = await request(app.getHttpServer())
      .get(`/api/social/crews/${crew.id}/participants`)
      .query({ limit: 20 })
      .set(authHeaders(outsider.accessToken));
    const visible = await request(app.getHttpServer())
      .get(`/api/social/crews/${crew.id}/participants`)
      .query({ limit: 20 })
      .set(authHeaders(participant.accessToken));

    expect(hidden.status).toBe(200);
    expect(hidden.body).toEqual({ participants: [], nextCursor: null });
    expect(visible.status).toBe(200);
    expectSchema(listCrewParticipantsResponseSchema, visible.body);
    expect(visible.body.participants).toHaveLength(2);
  });

  it('PATCH /api/social/crews/:id updates only a crew led by the caller and returns 204', async () => {
    const leader = await crewUser('crew_update_leader');
    const outsider = await crewUser('crew_update_outsider');
    const crew = await createCrew(leader.accessToken, leader.userId);

    const forbidden = await request(app.getHttpServer())
      .patch(`/api/social/crews/${crew.id}`)
      .set(authHeaders(outsider.accessToken))
      .send({ name: 'Updated Crew', privacy: 'private' });
    const updated = await request(app.getHttpServer())
      .patch(`/api/social/crews/${crew.id}`)
      .set(authHeaders(leader.accessToken))
      .send({ name: 'Updated Crew', privacy: 'private' });

    expect(forbidden.status).toBe(404);
    expect(updated.status).toBe(204);
    expect(updated.text).toBe('');
    expect(await getCrewByLeaderId(leader.userId)).toMatchObject({ privacy: 'private' });
  });

  it('a crew leader without an active membership cannot manage the crew', async () => {
    const leader = await crewUser('crew_inactive_leader');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await setCrewMembershipStatus(crew.id, leader.userId, 'left');

    const response = await request(app.getHttpServer())
      .patch(`/api/social/crews/${crew.id}`)
      .set(authHeaders(leader.accessToken))
      .send({ name: 'Updated Crew', privacy: 'private' });

    expect(response.status).toBe(404);
    expect(await getCrewByLeaderId(leader.userId)).toMatchObject({ privacy: 'public' });
  });

  it('POST /api/social/crews/:id/leave marks a regular member as left', async () => {
    const leader = await crewUser('crew_leave_leader');
    const member = await crewUser('crew_leave_member');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await insertCrewMembership(crew.id, member.userId);

    const response = await request(app.getHttpServer()).post(`/api/social/crews/${crew.id}/leave`).set(authHeaders(member.accessToken));

    expect(response.status, JSON.stringify(response.body)).toBe(204);
    expect(response.text).toBe('');
    expect(await getCrewMembership(crew.id, member.userId)).toMatchObject({ status: 'left', role: 'member' });
    expect(await getCrewById(crew.id)).toMatchObject({ leader_id: leader.userId });
  });

  it('POST leave transfers leadership to participant number two before the leader leaves', async () => {
    const leader = await crewUser('crew_transfer_leader');
    const successor = await crewUser('crew_transfer_successor');
    const member = await crewUser('crew_transfer_member');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await insertCrewMembership(crew.id, successor.userId, 'admin');
    await insertCrewMembership(crew.id, member.userId);

    const response = await request(app.getHttpServer()).post(`/api/social/crews/${crew.id}/leave`).set(authHeaders(leader.accessToken));

    expect(response.status).toBe(204);
    expect(await getCrewById(crew.id)).toMatchObject({ leader_id: successor.userId });
    expect(await getCrewMembership(crew.id, successor.userId)).toMatchObject({ status: 'active', role: 'leader' });
    expect(await getCrewMembership(crew.id, leader.userId)).toMatchObject({ status: 'left', role: 'member' });
  });

  it('POST leave deletes the crew for its last member and rejects a non-member', async () => {
    const leader = await crewUser('crew_leave_solo');
    const outsider = await crewUser('crew_leave_outsider');
    const crew = await createCrew(leader.accessToken, leader.userId);

    const noSuccessor = await request(app.getHttpServer()).post(`/api/social/crews/${crew.id}/leave`).set(authHeaders(leader.accessToken));
    expect(noSuccessor.status).toBe(204);
    expect(await getCrewById(crew.id)).toBeNull();

    const notMember = await request(app.getHttpServer()).post(`/api/social/crews/${crew.id}/leave`).set(authHeaders(outsider.accessToken));
    expect(notMember.status).toBe(404);
  });

  it('DELETE /api/social/crews/:id deletes only a crew led by the caller and returns 204', async () => {
    const leader = await crewUser('crew_delete_leader');
    const member = await crewUser('crew_delete_member');
    const outsider = await crewUser('crew_delete_outsider');
    const crew = await createCrew(leader.accessToken, leader.userId);
    const otherCrew = await createCrew(leader.accessToken, leader.userId);
    await insertCrewMembership(crew.id, member.userId);
    await insertCrewMembership(otherCrew.id, member.userId);

    const exclusivePostResponse = await request(app.getHttpServer())
      .post('/api/social/posts')
      .set(authHeaders(member.accessToken))
      .send({ content: 'Exclusive crew post', visibility: 'crews_only', crewIds: [crew.id] });
    const publicPostResponse = await request(app.getHttpServer())
      .post('/api/social/posts')
      .set(authHeaders(member.accessToken))
      .send({ content: 'Public crew post', visibility: 'public', crewIds: [crew.id] });
    const sharedPostResponse = await request(app.getHttpServer())
      .post('/api/social/posts')
      .set(authHeaders(member.accessToken))
      .send({ content: 'Multi-crew post', visibility: 'crews_only', crewIds: [crew.id, otherCrew.id] });

    expect(exclusivePostResponse.status).toBe(201);
    expect(publicPostResponse.status).toBe(201);
    expect(sharedPostResponse.status).toBe(201);
    expect(await getPostByAuthorId(member.userId)).not.toBeNull();

    const forbidden = await request(app.getHttpServer()).delete(`/api/social/crews/${crew.id}`).set(authHeaders(outsider.accessToken));
    const deleted = await request(app.getHttpServer()).delete(`/api/social/crews/${crew.id}`).set(authHeaders(leader.accessToken));

    expect(forbidden.status).toBe(404);
    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe('');
    expect(await crewExists(crew.id)).toBe(false);
    expect(await getPostByContent('Exclusive crew post')).toBeNull();
    expect(await getPostByContent('Public crew post')).not.toBeNull();
    expect(await getPostByContent('Multi-crew post')).not.toBeNull();
  });

  it('crew endpoints reject invalid and unauthenticated requests', async () => {
    const user = await crewUser('crew_invalid');
    const malformedCreate = await request(app.getHttpServer())
      .post('/api/social/crews')
      .set(authHeaders(user.accessToken))
      .send({ privacy: 'hidden' });
    const malformedId = await request(app.getHttpServer()).get('/api/social/crews/not-a-uuid').set(authHeaders(user.accessToken));
    const malformedPagination = await request(app.getHttpServer()).get('/api/social/crews').query({ limit: 101 }).set(authHeaders(user.accessToken));
    const malformedRequestStatus = await request(app.getHttpServer())
      .patch(`/api/social/crews/participation-requests/${crypto.randomUUID()}`)
      .set(authHeaders(user.accessToken))
      .send({ status: 'pending' });
    const unauthenticated = await request(app.getHttpServer()).get('/api/social/crews').query({ limit: 20, offset: 0 }).set('x-app-version', '4.5.0');

    expect(malformedCreate.status).toBe(400);
    expect(malformedId.status).toBe(400);
    expect(malformedPagination.status).toBe(400);
    expect(malformedRequestStatus.status).toBe(400);
    expect(unauthenticated.status).toBe(401);
  });
});
