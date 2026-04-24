import crypto from 'crypto';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  getAuthenticatedUserByIdResponseSchema,
  loginResponseSchema,
  setProfilePicAndUpdateDBResponseSchema,
  updateAuthenticatedUserResponseSchema,
} from '@strong-together/shared';
import { createApp } from '../../../app';
import { authHeaders, createChangeEmailToken } from '../../../common/tests/helpers/auth';
import { expectSchema } from '../../../common/tests/helpers/assert-schema';
import { appConfig } from '../../../config/app.config';
import { supabaseConfig } from '../../../config/storage.config';
import { getUserAuthStateByUsername, waitForUserDeletionByUsername } from '../../../common/tests/helpers/db';
import {
  clearEmailQueue,
  clearMaildevMessages,
  deleteRedisKeysByPattern,
  deliverLatestEmailJobToMaildev,
  ensureS3Bucket,
  getEmailQueueJobCount,
  getLatestEmailJob,
  headUploadedObject,
  waitForMaildevMessage,
} from '../../../common/tests/helpers/infra';
import { cleanupTestUsers, createAndLoginTestUser } from '../../../common/tests/helpers/users';

let app: Awaited<ReturnType<typeof createApp>>;
const users = new Set<string>();

beforeAll(async () => {
  app = await createApp();
}, 30000);

beforeEach(async () => {
  await clearEmailQueue();
  await clearMaildevMessages();
});

afterEach(async () => {
  await deleteRedisKeysByPattern('emailchange:jti:*');
  await cleanupTestUsers(users);
  users.clear();
});

describe('UpdateUserController', () => {
  it('GET /api/users/get returns authenticated user schema from DB', async () => {
    const user = await createAndLoginTestUser(app, 'user_get');
    users.add(user.username);
    expectSchema(loginResponseSchema, user.loginResponse.body);

    const response = await request(app.getHttpServer()).get('/api/users/get').set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expectSchema(getAuthenticatedUserByIdResponseSchema, response.body);
    expect(response.body).toMatchObject({ id: user.userId, username: user.username, email: user.email });
  });

  it('PUT /api/users/updateself updates DB profile and preserves response schema', async () => {
    const user = await createAndLoginTestUser(app, 'user_update');
    users.add(user.username);
    const nextUsername = `upd${crypto.randomUUID().slice(0, 6)}`;
    users.add(nextUsername);

    const response = await request(app.getHttpServer()).put('/api/users/updateself').set(authHeaders(user.accessToken)).send({
      username: nextUsername,
      fullName: 'Updated User',
    });

    expect(response.status).toBe(200);
    expectSchema(updateAuthenticatedUserResponseSchema, response.body);
    expect(response.body.emailChanged).toBe(false);
    expect(response.body.user.username).toBe(nextUsername);
    expect((await getUserAuthStateByUsername(nextUsername))?.name).toBe('Updated User');
    users.delete(user.username);
  });

  it('PUT /api/users/updateself sends email-change job and GET /api/users/changeemail confirms DB email with Redis JTI', async () => {
    const user = await createAndLoginTestUser(app, 'user_email');
    users.add(user.username);
    const newEmail = `updated_${crypto.randomUUID().slice(0, 8)}@example.com`;

    const update = await request(app.getHttpServer()).put('/api/users/updateself').set(authHeaders(user.accessToken)).send({
      email: newEmail,
    });

    expect(update.status).toBe(200);
    expectSchema(updateAuthenticatedUserResponseSchema, update.body);
    expect(update.body.emailChanged).toBe(true);
    expect((await getUserAuthStateByUsername(user.username))?.email).toBe(user.email);
    expect(await getEmailQueueJobCount()).toBe(1);
    const latestJob = await getLatestEmailJob();
    expect(latestJob?.data.to).toBe(newEmail);
    expect(latestJob?.data.html).toContain(`${appConfig.emailApiBaseUrl}/api/users/changeemail`);
    expect(latestJob?.data.html).toContain('https://strongtogether.kobihanoch.com/appicon.png');
    await deliverLatestEmailJobToMaildev();
    expect(JSON.stringify(await waitForMaildevMessage('Confirm'))).toContain(newEmail);

    const token = createChangeEmailToken(user.userId, newEmail);
    const confirm = await request(app.getHttpServer())
      .get('/api/users/changeemail')
      .query({ token })
      .set('x-app-version', '4.5.0');
    const reused = await request(app.getHttpServer())
      .get('/api/users/changeemail')
      .query({ token })
      .set('x-app-version', '4.5.0');

    expect(confirm.status).toBe(200);
    expect(confirm.headers['content-type']).toContain('text/html');
    expect((await getUserAuthStateByUsername(user.username))?.email).toBe(newEmail);
    expect(reused.status).toBe(401);
  });

  it('DELETE /api/users/deleteself removes the user row from DB', async () => {
    const user = await createAndLoginTestUser(app, 'user_delete');
    users.add(user.username);

    const response = await request(app.getHttpServer()).delete('/api/users/deleteself').set(authHeaders(user.accessToken));

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
    expect(await waitForUserDeletionByUsername(user.username)).toBeNull();
    users.delete(user.username);
  });

  it('PUT and DELETE profile image use LocalStack S3 and update DB profile state', async () => {
    const user = await createAndLoginTestUser(app, 'user_pic');
    users.add(user.username);
    await ensureS3Bucket(supabaseConfig.bucketName);

    const upload = await request(app.getHttpServer())
      .put('/api/users/setprofilepic')
      .set(authHeaders(user.accessToken))
      .attach('file', Buffer.from('fake-image'), { filename: 'avatar.png', contentType: 'image/png' });

    expect(upload.status).toBe(201);
    expectSchema(setProfilePicAndUpdateDBResponseSchema, upload.body);
    expect(upload.body.path).toMatch(new RegExp(`^${supabaseConfig.bucketName}/${user.userId}/.+\\.png$`));

    const key = upload.body.path.replace(`${supabaseConfig.bucketName}/`, '');
    expect((await headUploadedObject(key, supabaseConfig.bucketName)).ContentType).toBe('image/png');

    const getAfterUpload = await request(app.getHttpServer()).get('/api/users/get').set(authHeaders(user.accessToken));
    expectSchema(getAuthenticatedUserByIdResponseSchema, getAfterUpload.body);
    expect(getAfterUpload.body.profile_image_url).toBe(upload.body.path);

    const deleted = await request(app.getHttpServer())
      .delete('/api/users/deleteprofilepic')
      .set(authHeaders(user.accessToken))
      .send({ path: upload.body.path });

    expect(deleted.status).toBe(200);
    const getAfterDelete = await request(app.getHttpServer()).get('/api/users/get').set(authHeaders(user.accessToken));
    expectSchema(getAuthenticatedUserByIdResponseSchema, getAfterDelete.body);
    expect(getAfterDelete.body.profile_image_url).toBeNull();
  }, 30000);

  it('profile image endpoints reject bad requests without touching DB storage fields', async () => {
    const user = await createAndLoginTestUser(app, 'user_pic_bad');
    users.add(user.username);

    const noFile = await request(app.getHttpServer()).put('/api/users/setprofilepic').set(authHeaders(user.accessToken));
    const badDelete = await request(app.getHttpServer())
      .delete('/api/users/deleteprofilepic')
      .set(authHeaders(user.accessToken))
      .send({});

    expect(noFile.status).toBe(400);
    expect(noFile.body.message).toBe('No file provided');
    expect(badDelete.status).toBe(400);
  });

  it('user update endpoints reject 400/401 bad paths', async () => {
    const user = await createAndLoginTestUser(app, 'user_bad');
    users.add(user.username);
    const noAuth = await request(app.getHttpServer()).get('/api/users/get').set('x-app-version', '4.5.0');
    const badUpdate = await request(app.getHttpServer()).put('/api/users/updateself').set(authHeaders(user.accessToken)).send({
      username: 'ab',
    });
    const missingChangeToken = await request(app.getHttpServer()).get('/api/users/changeemail').set('x-app-version', '4.5.0');

    expect(noAuth.status).toBe(401);
    expect(badUpdate.status).toBe(400);
    expect(missingChangeToken.status).toBe(401);
  });
});
