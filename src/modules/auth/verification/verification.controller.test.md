# Verification Controller Test Checks

## Happy Paths

### `GET /api/auth/verify`

- [x] Verifies the token.
- [x] Updates verification state in DB.
- [x] Stores JTI in Redis to block reuse.

### `POST /api/auth/sendverificationemail`

- [x] Enqueues a Redis-backed verification email.
- [x] Includes expected email assets.
- [x] Keeps missing-user handling private.

### `PUT /api/auth/changeemailverify`

- [x] Updates pending email in DB.
- [x] Sends a verification email for the pending address.

### `GET /api/auth/checkuserverify`

- [x] Returns the user's verification state.

## Bad Paths

### Verification endpoints

- [x] Reject bad inputs with `400`.
- [x] Reject missing auth with `401` where auth is required.

## Edge Cases

### Verify token reuse

- [x] Redis JTI prevents reusing the same verification token.

### Missing user email request

- [x] Does not leak whether the user exists.
