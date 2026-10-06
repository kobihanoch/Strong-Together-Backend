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
  getCrewByCreatedBy,
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

async function createCrew(accessToken: string, createdBy: string) {
  const response = await request(app.getHttpServer())
    .post('/api/social/crews')
    .set(authHeaders(accessToken))
    .send({ name: 'Test Crew', privacy: 'public' });

  expect(response.status, JSON.stringify(response.body)).toBe(201);

  const crew = await getCrewByCreatedBy(createdBy);
  expect(crew).not.toBeNull();
  return crew!;
}

async function createPost(accessToken: string, body: { content: string; visibility: 'crews_only' | 'public'; crewIds?: string[] }) {
  const response = await request(app.getHttpServer()).post('/api/social/posts').set(authHeaders(accessToken)).send(body);

  expect(response.status, JSON.stringify(response.body)).toBe(201);
  expect(response.text).toBe('');
}

describe('PostsController', () => {
  /** Enforces post ownership across update and delete, including state preservation after forbidden attempts. */
  it('PATCH and DELETE posts allow only the author and do not mutate state after rejected attempts', async () => {
    const author = await postUser('post_mutation_author');
    const outsider = await postUser('post_mutation_outsider');
    await createPost(author.accessToken, { content: 'Original content', visibility: 'public' });
    const post = await getPostByAuthorId(author.userId);

    const forbiddenUpdate = await request(app.getHttpServer())
      .patch(`/api/social/posts/${post!.id}`)
      .set(authHeaders(outsider.accessToken))
      .send({ content: 'Stolen content' });
    expect(forbiddenUpdate.status).toBe(404);
    expect(await getPostByAuthorId(author.userId)).toMatchObject({ content: 'Original content' });

    const update = await request(app.getHttpServer())
      .patch(`/api/social/posts/${post!.id}`)
      .set(authHeaders(author.accessToken))
      .send({ content: 'Updated content' });
    expect(update.status).toBe(204);
    expect(update.text).toBe('');
    expect(await getPostByAuthorId(author.userId)).toMatchObject({ content: 'Updated content' });

    const forbiddenDelete = await request(app.getHttpServer()).delete(`/api/social/posts/${post!.id}`).set(authHeaders(outsider.accessToken));
    expect(forbiddenDelete.status).toBe(404);
    expect(await getPostByAuthorId(author.userId)).not.toBeNull();

    const deletion = await request(app.getHttpServer()).delete(`/api/social/posts/${post!.id}`).set(authHeaders(author.accessToken));
    expect(deletion.status).toBe(204);
    expect(deletion.text).toBe('');
    expect(await getPostByAuthorId(author.userId)).toBeNull();

    const repeatedDeletion = await request(app.getHttpServer()).delete(`/api/social/posts/${post!.id}`).set(authHeaders(author.accessToken));
    expect(repeatedDeletion.status).toBe(404);
  });

  /** Enforces the complete comment lifecycle, author ownership, validation, and deletion finality. */
  it('comment mutations preserve ownership and expose the exact persisted lifecycle', async () => {
    const author = await postUser('comment_lifecycle_author');
    const commenter = await postUser('comment_lifecycle_commenter');
    const outsider = await postUser('comment_lifecycle_outsider');
    await createPost(author.accessToken, { content: 'Comment target', visibility: 'public' });
    const post = await getPostByAuthorId(author.userId);

    const invalidComment = await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/comments`)
      .set(authHeaders(commenter.accessToken))
      .send({ content: '   ' });
    expect(invalidComment.status).toBe(400);

    const creation = await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/comments`)
      .set(authHeaders(commenter.accessToken))
      .send({ content: 'Original comment' });
    expect(creation.status).toBe(201);
    expect(creation.text).toBe('');

    const listed = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/comments`)
      .query({ limit: 20 })
      .set(authHeaders(author.accessToken));
    expectSchema(listPostCommentsResponseSchema, listed.body);
    const comment = listed.body.comments.find((item: { userId: string }) => item.userId === commenter.userId);
    expect(comment).toMatchObject({ content: 'Original comment', postId: post!.id, userId: commenter.userId });

    const forbiddenEdit = await request(app.getHttpServer())
      .patch(`/api/social/posts/comments/${comment.id}`)
      .set(authHeaders(outsider.accessToken))
      .send({ content: 'Hijacked comment' });
    expect(forbiddenEdit.status).toBe(404);

    await request(app.getHttpServer())
      .patch(`/api/social/posts/comments/${comment.id}`)
      .set(authHeaders(commenter.accessToken))
      .send({ content: 'Edited comment' })
      .expect(204);
    const afterEdit = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/comments`)
      .query({ limit: 20 })
      .set(authHeaders(author.accessToken));
    expect(afterEdit.body.comments).toEqual(expect.arrayContaining([expect.objectContaining({ id: comment.id, content: 'Edited comment' })]));

    await request(app.getHttpServer()).delete(`/api/social/posts/comments/${comment.id}`).set(authHeaders(outsider.accessToken)).expect(404);
    await request(app.getHttpServer()).delete(`/api/social/posts/comments/${comment.id}`).set(authHeaders(commenter.accessToken)).expect(204);
    await request(app.getHttpServer()).delete(`/api/social/posts/comments/${comment.id}`).set(authHeaders(commenter.accessToken)).expect(404);

    const afterDelete = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/comments`)
      .query({ limit: 20 })
      .set(authHeaders(author.accessToken));
    expect(afterDelete.body.comments).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: comment.id })]));
  });

  /** Enforces one reaction per user, replacement semantics, caller-scoped deletion, and input validation. */
  it('reaction mutations replace instead of duplicate and delete only the caller reaction', async () => {
    const author = await postUser('reaction_lifecycle_author');
    const reactor = await postUser('reaction_lifecycle_reactor');
    const outsider = await postUser('reaction_lifecycle_outsider');
    await createPost(author.accessToken, { content: 'Reaction target', visibility: 'public' });
    const post = await getPostByAuthorId(author.userId);

    await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/reactions`)
      .set(authHeaders(reactor.accessToken))
      .send({ type: 'like' })
      .expect(201);
    const initial = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/reactions`)
      .query({ limit: 20 })
      .set(authHeaders(author.accessToken));
    const originalReaction = initial.body.reactions.find((item: { userId: string }) => item.userId === reactor.userId);
    expect(originalReaction).toMatchObject({ postId: post!.id, type: 'like' });

    await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/reactions`)
      .set(authHeaders(reactor.accessToken))
      .send({ type: 'muscle' })
      .expect(201);
    const replaced = await request(app.getHttpServer())
      .get(`/api/social/posts/${post!.id}/reactions`)
      .query({ limit: 20 })
      .set(authHeaders(author.accessToken));
    const userReactions = replaced.body.reactions.filter((item: { userId: string }) => item.userId === reactor.userId);
    expect(userReactions).toHaveLength(1);
    expect(userReactions[0]).toMatchObject({ id: originalReaction.id, type: 'muscle' });

    await request(app.getHttpServer()).delete(`/api/social/posts/${post!.id}/reactions`).set(authHeaders(outsider.accessToken)).expect(404);
    await request(app.getHttpServer()).delete(`/api/social/posts/${post!.id}/reactions`).set(authHeaders(reactor.accessToken)).expect(204);
    await request(app.getHttpServer()).delete(`/api/social/posts/${post!.id}/reactions`).set(authHeaders(reactor.accessToken)).expect(404);

    const invalidType = await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/reactions`)
      .set(authHeaders(reactor.accessToken))
      .send({ type: 'invalid' });
    expect(invalidType.status).toBe(400);
  });

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
    const post = await getPostByAuthorId(leader.userId);
    await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/comments`)
      .set(authHeaders(outsider.accessToken))
      .send({ content: 'Great work' })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/reactions`)
      .set(authHeaders(outsider.accessToken))
      .send({ type: 'like' })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/reactions`)
      .set(authHeaders(leader.accessToken))
      .send({ type: 'muscle' })
      .expect(201);

    const response = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 20 }).set(authHeaders(outsider.accessToken));

    expect(response.status).toBe(200);
    expectSchema(listVisiblePostsResponseSchema, response.body);
    expect(response.body.posts).toEqual(expect.arrayContaining([expect.objectContaining({ content: 'Public crew update', visibility: 'public' })]));
    const returnedPost = response.body.posts.find((post: { content: string }) => post.content === 'Public crew update');
    expect(returnedPost).toMatchObject({
      authorUserId: leader.userId,
      username: expect.any(String),
      fullName: expect.any(String),
      interactions: {
        reactionsCount: { likesCount: 1, fireUpCount: 0, muscleCount: 1 },
        commentsCount: 1,
      },
    });
    expect(returnedPost).toHaveProperty('profilePicPath');
    expect(returnedPost).not.toHaveProperty('crewId');
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
    await request(app.getHttpServer())
      .post(`/api/social/posts/${post!.id}/comments`)
      .set(authHeaders(author.accessToken))
      .send({ content: 'Second' });

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

    const outsiderResponse = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 20 }).set(authHeaders(outsider.accessToken));
    const memberResponse = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 20 }).set(authHeaders(member.accessToken));

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

  /** Enforces request-contract validation, missing-resource behavior, and authentication across posts, comments, and reactions. */
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
    const invalidPagination = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 101 }).set(authHeaders(user.accessToken));
    const invalidPostUpdate = await request(app.getHttpServer())
      .patch('/api/social/posts/not-a-uuid')
      .set(authHeaders(user.accessToken))
      .send({ content: 'Valid content' });
    const malformedCommentPost = await request(app.getHttpServer())
      .get('/api/social/posts/not-a-uuid/comments')
      .query({ limit: 20 })
      .set(authHeaders(user.accessToken));
    const invalidCommentPagination = await request(app.getHttpServer())
      .get(`/api/social/posts/${crypto.randomUUID()}/comments`)
      .query({ limit: 0 })
      .set(authHeaders(user.accessToken));
    const invalidCommentEdit = await request(app.getHttpServer())
      .patch(`/api/social/posts/comments/${crypto.randomUUID()}`)
      .set(authHeaders(user.accessToken))
      .send({ content: '   ' });
    const invalidReactionType = await request(app.getHttpServer())
      .post(`/api/social/posts/${crypto.randomUUID()}/reactions`)
      .set(authHeaders(user.accessToken))
      .send({ type: 'love' });
    const invalidReactionPagination = await request(app.getHttpServer())
      .get(`/api/social/posts/${crypto.randomUUID()}/reactions`)
      .query({ limit: 101 })
      .set(authHeaders(user.accessToken));
    const missingComment = await request(app.getHttpServer())
      .delete(`/api/social/posts/comments/${crypto.randomUUID()}`)
      .set(authHeaders(user.accessToken));
    const missingReaction = await request(app.getHttpServer())
      .delete(`/api/social/posts/${crypto.randomUUID()}/reactions`)
      .set(authHeaders(user.accessToken));
    const unauthenticated = await request(app.getHttpServer()).get('/api/social/posts').query({ limit: 20, offset: 0 }).set('x-app-version', '4.5.0');
    const unauthenticatedComments = await request(app.getHttpServer())
      .get(`/api/social/posts/${crypto.randomUUID()}/comments`)
      .query({ limit: 20 })
      .set('x-app-version', '4.5.0');
    const unauthenticatedReactions = await request(app.getHttpServer())
      .get(`/api/social/posts/${crypto.randomUUID()}/reactions`)
      .query({ limit: 20 })
      .set('x-app-version', '4.5.0');

    expect(missingVisibility.status).toBe(400);
    expect(crewOnlyWithoutCrews.status).toBe(400);
    expect(duplicateCrews.status).toBe(400);
    expect(invalidPagination.status).toBe(400);
    expect(invalidPostUpdate.status).toBe(400);
    expect(malformedCommentPost.status).toBe(400);
    expect(invalidCommentPagination.status).toBe(400);
    expect(invalidCommentEdit.status).toBe(400);
    expect(invalidReactionType.status).toBe(400);
    expect(invalidReactionPagination.status).toBe(400);
    expect(missingComment.status).toBe(404);
    expect(missingReaction.status).toBe(404);
    expect(unauthenticated.status).toBe(401);
    expect(unauthenticatedComments.status).toBe(401);
    expect(unauthenticatedReactions.status).toBe(401);
  });
});
