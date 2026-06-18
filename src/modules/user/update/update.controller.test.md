# Update User Controller Test Checks

## User Labels

Each test creates or authenticates the user it needs, then verifies that same user's DB, Redis, email, or S3 side effects.

## Happy Paths

### `GET /api/users/get`

- [x] Returns the authenticated user from DB.
- [x] Validates the response schema.

### `PUT /api/users/updateself`

- [x] Updates profile fields in DB.
- [x] Preserves response schema.

### Email change flow

- [x] Enqueues email-change job.
- [x] Confirms email change through `GET /api/users/changeemail`.
- [x] Stores Redis JTI to prevent token reuse.
- [x] Updates DB email.

### `DELETE /api/users/deleteself`

- [x] Removes the user row from DB.

### Profile image endpoints

- [x] Upload uses LocalStack S3.
- [x] Delete removes the stored image.
- [x] DB profile image fields are updated.

## Bad Paths

### User update endpoints

- [x] Reject bad requests with `400`.
- [x] Reject missing auth with `401`.

### Profile image endpoints

- [x] Reject bad requests.
- [x] Do not touch DB storage fields on failure.

## Edge Cases

### Email change flow

- [x] Email job is queued before confirmation updates the DB email.

### Profile image storage

- [x] S3 state and DB state stay in sync.
