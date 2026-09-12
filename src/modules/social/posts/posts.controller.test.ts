import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  listCrewPostsResponseSchema,
  listPostCommentsResponseSchema,
  listPostReactionsResponseSchema,
  listVisiblePostsResponseSchema,
} from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import {
  getCrewByLeaderId,
  getPostByAuthorId,
  getPostPlacementCount,
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

async function postUser(prefix: string) {
  const user = await createAndLoginTestUser(app, prefix);
  users.add(user.username);
  return user;
}

async function createCrew(accessToken: string, leaderId: string) {
  const response = await request(app.getHttpServer()).post('/api/social/crews').set(authHeaders(accessToken)).send({ privacy: 'public' });

  expect(response.status, JSON.stringify(response.body)).toBe(201);

  const crew = await getCrewByLeaderId(leaderId);
  expect(crew).not.toBeNull();
  return crew!;
}

async function createPost(accessToken: string, body: { content: string; visibility: 'crews_only' | 'public'; crewIds?: string[] }) {
  const response = await request(app.getHttpServer()).post('/api/social/posts').set(authHeaders(accessToken)).send(body);

  expect(response.status, JSON.stringify(response.body)).toBe(201);
  expect(response.text).toBe('');
}

describe('PostsController', () => {
  it('POST /api/social/posts creates a post with explicit visibility', async () => {
    const author = await postUser('post_create');

    await createPost(author.accessToken, { content: 'Public progress', visibility: 'public' });

    expect(await getPostByAuthorId(author.userId)).toMatchObject({ content: 'Public progress', visibility: 'public' });
  });

  it('GET /api/social/posts exposes public crew-shared posts to outsiders', async () => {
    const leader = await postUser('post_public_leader');
    const outsider = await postUser('post_public_outsider');
    const crew = await createCrew(leader.accessToken, leader.userId);

    await createPost(leader.accessToken, { content: 'Public crew update', visibility: 'public', crewIds: [crew.id] });

    const response = await request(app.getHttpServer())
      .get('/api/social/posts')
      .query({ limit: 20 })
      .set(authHeaders(outsider.accessToken));

    expect(response.status).toBe(200);
    expectSchema(listVisiblePostsResponseSchema, response.body);
    expect(response.body.posts).toEqual(expect.arrayContaining([expect.objectContaining({ content: 'Public crew update', visibility: 'public' })]));
    expect(response.body.posts.find((post: { content: string }) => post.content === 'Public crew update')).not.toHaveProperty('crewId');
  });

  it('GET /api/social/posts continues from the returned cursor without repeating posts', async () => {
    const author = await postUser('post_cursor_author');
    await createPost(author.accessToken, { content: 'Cursor first', visibility: 'public' });
    await createPost(author.accessToken, { content: 'Cursor second', visibility: 'public' });

    const firstPage = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 1 }).set(authHeaders(author.accessToken));
    const secondPage = await request(app.getHttpServer())
      .get('/api/social/posts')
      .query({ limit: 1, cursor: firstPage.body.nextCursor })
      .set(authHeaders(author.accessToken));

    expect(firstPage.body.nextCursor).toEqual(expect.any(String));
    expect(secondPage.body.posts).toHaveLength(1);
    expect(secondPage.body.posts[0].id).not.toBe(firstPage.body.posts[0].id);
  });

  it('GET post comments returns cursor-paginated comments on a visible post', async () => {
    const author = await postUser('comment_list_author');
    await createPost(author.accessToken, { content: 'Commented post', visibility: 'public' });
    const post = await getPostByAuthorId(author.userId);

    await request(app.getHttpServer()).post(`/api/social/posts/${post!.id}/comments`).set(authHeaders(author.accessToken)).send({ content: 'First' });
    await request(app.getHttpServer()).post(`/api/social/posts/${post!.id}/comments`).set(authHeaders(author.accessToken)).send({ content: 'Second' });

    const firstPage = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/comments`)
      .query({ limit: 1 })
      .set(authHeaders(author.accessToken));
    const secondPage = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/comments`)
      .query({ limit: 1, cursor: firstPage.body.nextCursor })
      .set(authHeaders(author.accessToken));

    expectSchema(listPostCommentsResponseSchema, firstPage.body);
    expect(firstPage.body.comments[0].content).toBe('First');
    expect(secondPage.body.comments[0].content).toBe('Second');
  });

  it('GET post reactions returns cursor-paginated reactions on a visible post', async () => {
    const author = await postUser('reaction_list_author');
    const reactor = await postUser('reaction_list_user');
    await createPost(author.accessToken, { content: 'Reacted post', visibility: 'public' });
    const post = await getPostByAuthorId(author.userId);

    const authorReaction = await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/reactions`)
      .set(authHeaders(author.accessToken))
      .send({ type: 'like' });
    const userReaction = await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/reactions`)
      .set(authHeaders(reactor.accessToken))
      .send({ type: 'muscle' });

    expect(authorReaction.status, JSON.stringify(authorReaction.body)).toBe(201);
    expect(userReaction.status, JSON.stringify(userReaction.body)).toBe(201);

    const firstPage = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/reactions`)
      .query({ limit: 1 })
      .set(authHeaders(author.accessToken));
    const secondPage = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/reactions`)
      .query({ limit: 1, cursor: firstPage.body.nextCursor })
      .set(authHeaders(author.accessToken));

    expectSchema(listPostReactionsResponseSchema, firstPage.body);
    expect(firstPage.body.reactions).toHaveLength(1);
    expect(secondPage.body.reactions).toHaveLength(1);
    expect(secondPage.body.reactions[0].id).not.toBe(firstPage.body.reactions[0].id);
  });

  it('GET /api/social/posts hides crew-only posts from outsiders and exposes them to active members', async () => {
    const leader = await postUser('post_private_leader');
    const member = await postUser('post_private_member');
    const outsider = await postUser('post_private_outsider');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await insertCrewMembership(crew.id, member.userId);
    await createPost(leader.accessToken, { content: 'Members only', visibility: 'crews_only', crewIds: [crew.id] });

    const outsiderResponse = await request(app.getHttpServer())
      .get('/api/social/posts')
      .query({ limit: 20 })
      .set(authHeaders(outsider.accessToken));
    const memberResponse = await request(app.getHttpServer())
      .get('/api/social/posts')
      .query({ limit: 20 })
      .set(authHeaders(member.accessToken));

    expect(outsiderResponse.body.posts).not.toEqual(expect.arrayContaining([expect.objectContaining({ content: 'Members only' })]));
    expect(memberResponse.body.posts).toEqual(expect.arrayContaining([expect.objectContaining({ content: 'Members only' })]));
  });

  it('GET /api/social/posts/crew/:crewId returns the paginated crew feed to active participants', async () => {
    const leader = await postUser('post_crew_leader');
    const member = await postUser('post_crew_member');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await insertCrewMembership(crew.id, member.userId);
    await createPost(leader.accessToken, { content: 'Crew feed post', visibility: 'public', crewIds: [crew.id] });

    const response = await request(app.getHttpServer())
      .get(`/api/social/posts/crew/${crew.id}`)
      .query({ limit: 1 })
      .set(authHeaders(member.accessToken));

    expect(response.status).toBe(200);
    expectSchema(listCrewPostsResponseSchema, response.body);
    expect(response.body.posts).toHaveLength(1);
    expect(response.body.posts[0]).toMatchObject({ content: 'Crew feed post', visibility: 'public' });
    expect(response.body.posts[0]).not.toHaveProperty('crewId');
  });

  it('GET /api/social/posts returns a multiply placed post only once', async () => {
    const leader = await postUser('post_multi_leader');
    const firstCrew = await createCrew(leader.accessToken, leader.userId);
    const secondCrew = await createCrew(leader.accessToken, leader.userId);
    await createPost(leader.accessToken, {
      content: 'Shared twice',
      visibility: 'crews_only',
      crewIds: [firstCrew.id, secondCrew.id],
    });

    const post = await getPostByAuthorId(leader.userId);
    const response = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 20 }).set(authHeaders(leader.accessToken));

    expect(post).not.toBeNull();
    expect(await getPostPlacementCount(post!.id)).toBe(2);
    expect(response.body.posts.filter((item: { id: string }) => item.id === post!.id)).toHaveLength(1);
  });

  it('POST /api/social/posts returns an RLS error and rolls back when any requested crew is unauthorized', async () => {
    const author = await postUser('post_partial_author');
    const otherLeader = await postUser('post_partial_other');
    const ownCrew = await createCrew(author.accessToken, author.userId);
    const inaccessibleCrew = await createCrew(otherLeader.accessToken, otherLeader.userId);

    const response = await request(app.getHttpServer())
      .post('/api/social/posts')
      .set(authHeaders(author.accessToken))
      .send({
        content: 'Must roll back',
        visibility: 'public',
        crewIds: [ownCrew.id, inaccessibleCrew.id],
      });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(await getPostByAuthorId(author.userId)).toBeNull();
  });

  it('a leader without an active membership cannot access the crew feed', async () => {
    const leader = await postUser('post_inactive_leader');
    const crew = await createCrew(leader.accessToken, leader.userId);
    await createPost(leader.accessToken, { content: 'Previous crew post', visibility: 'crews_only', crewIds: [crew.id] });
    await setCrewMembershipStatus(crew.id, leader.userId, 'left');

    const response = await request(app.getHttpServer())
      .get(`/api/social/posts/crew/${crew.id}`)
      .query({ limit: 20 })
      .set(authHeaders(leader.accessToken));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ posts: [], nextCursor: null });
  });

  it('post endpoints reject missing visibility, invalid pagination, and unauthenticated requests', async () => {
    const user = await postUser('post_invalid');
    const missingVisibility = await request(app.getHttpServer())
      .post('/api/social/posts')
      .set(authHeaders(user.accessToken))
      .send({ content: 'Missing visibility' });
    const crewOnlyWithoutCrews = await request(app.getHttpServer())
      .post('/api/social/posts')
      .set(authHeaders(user.accessToken))
      .send({ content: 'No audience', visibility: 'crews_only' });
    const duplicateCrews = await request(app.getHttpServer())
      .post('/api/social/posts')
      .set(authHeaders(user.accessToken))
      .send({
        content: 'Duplicate audience',
        visibility: 'public',
        crewIds: ['8b4b3368-7a41-4d7a-a387-cb234542f910', '8b4b3368-7a41-4d7a-a387-cb234542f910'],
      });
    const invalidPagination = await request(app.getHttpServer())
      .get('/api/social/posts')
      .query({ limit: 101 })
      .set(authHeaders(user.accessToken));
    const unauthenticated = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 20, offset: 0 }).set('x-app-version', '4.5.0');

    expect(missingVisibility.status).toBe(400);
    expect(crewOnlyWithoutCrews.status).toBe(400);
    expect(duplicateCrews.status).toBe(400);
    expect(invalidPagination.status).toBe(400);
    expect(unauthenticated.status).toBe(401);
  });
});
