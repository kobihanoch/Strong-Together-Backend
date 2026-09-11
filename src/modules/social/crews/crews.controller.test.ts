import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getCrewResponseSchema, listCrewParticipantsResponseSchema, listCrewsResponseSchema } from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import { crewExists, getCrewByLeaderId, insertCrewMembership } from '../../../common/tests/helpers/db';
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
  const response = await request(app.getHttpServer()).post('/api/social/crews').set(authHeaders(accessToken)).send({ privacy });

  expect(response.status).toBe(201);
  expect(response.text).toBe('');

  const crew = await getCrewByLeaderId(leaderId);
  expect(crew).not.toBeNull();
  return crew!;
}

describe('CrewsController', () => {
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

    const response = await request(app.getHttpServer()).get('/api/social/crews').query({ limit: 1, offset: 0 }).set(authHeaders(viewer.accessToken));

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
      .query({ limit: 1, offset: 0 })
      .set(authHeaders(viewer.accessToken));
    const secondPage = await request(app.getHttpServer())
      .get(`/api/social/crews/${crew.id}/participants`)
      .query({ limit: 1, offset: 1 })
      .set(authHeaders(viewer.accessToken));

    expect(firstPage.status).toBe(200);
    expect(secondPage.status).toBe(200);
    expectSchema(listCrewParticipantsResponseSchema, firstPage.body);
    expectSchema(listCrewParticipantsResponseSchema, secondPage.body);
    expect(firstPage.body.participants).toHaveLength(1);
    expect(secondPage.body.participants).toHaveLength(1);
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
      .query({ limit: 20, offset: 0 })
      .set(authHeaders(outsider.accessToken));
    const visible = await request(app.getHttpServer())
      .get(`/api/social/crews/${crew.id}/participants`)
      .query({ limit: 20, offset: 0 })
      .set(authHeaders(participant.accessToken));

    expect(hidden.status).toBe(200);
    expect(hidden.body).toEqual({ participants: [] });
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
      .send({ privacy: 'private' });
    const updated = await request(app.getHttpServer())
      .patch(`/api/social/crews/${crew.id}`)
      .set(authHeaders(leader.accessToken))
      .send({ privacy: 'private' });

    expect(forbidden.status).toBe(404);
    expect(updated.status).toBe(204);
    expect(updated.text).toBe('');
    expect(await getCrewByLeaderId(leader.userId)).toMatchObject({ privacy: 'private' });
  });

  it('DELETE /api/social/crews/:id deletes only a crew led by the caller and returns 204', async () => {
    const leader = await crewUser('crew_delete_leader');
    const outsider = await crewUser('crew_delete_outsider');
    const crew = await createCrew(leader.accessToken, leader.userId);

    const forbidden = await request(app.getHttpServer()).delete(`/api/social/crews/${crew.id}`).set(authHeaders(outsider.accessToken));
    const deleted = await request(app.getHttpServer()).delete(`/api/social/crews/${crew.id}`).set(authHeaders(leader.accessToken));

    expect(forbidden.status).toBe(404);
    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe('');
    expect(await crewExists(crew.id)).toBe(false);
  });

  it('crew endpoints reject invalid and unauthenticated requests', async () => {
    const user = await crewUser('crew_invalid');
    const malformedCreate = await request(app.getHttpServer())
      .post('/api/social/crews')
      .set(authHeaders(user.accessToken))
      .send({ privacy: 'hidden' });
    const malformedId = await request(app.getHttpServer()).get('/api/social/crews/not-a-uuid').set(authHeaders(user.accessToken));
    const malformedPagination = await request(app.getHttpServer())
      .get('/api/social/crews')
      .query({ limit: 101, offset: -1 })
      .set(authHeaders(user.accessToken));
    const unauthenticated = await request(app.getHttpServer()).get('/api/social/crews').query({ limit: 20, offset: 0 }).set('x-app-version', '4.5.0');

    expect(malformedCreate.status).toBe(400);
    expect(malformedId.status).toBe(400);
    expect(malformedPagination.status).toBe(400);
    expect(unauthenticated.status).toBe(401);
  });
});
