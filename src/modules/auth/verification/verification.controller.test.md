# Verification Controller Test Checks

## Happy Paths

### `GET /api/auth/email-verification`

- [x] Verifies the token.
- [x] Updates verification state in DB.
- [x] Stores JTI in Redis to block reuse.

### `POST /api/auth/verification-emails`

- [x] Enqueues a Redis-backed verification email.
- [x] Includes expected email assets.
- [x] Keeps missing-user handling private.

### `PATCH /api/auth/unverified-account/email`

- [x] Updates pending email in DB.
- [x] Sends a verification email for the pending address.

### `GET /api/auth/verification-status`

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
