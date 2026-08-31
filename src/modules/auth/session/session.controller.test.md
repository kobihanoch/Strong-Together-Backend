# Session Controller Test Checks

## Happy Paths

### `POST /api/auth/login`

- [x] Accepts valid credentials.
- [x] Returns auth tokens.
- [x] Updates DB session state.

### `POST /api/auth/refresh`

- [x] Rotates access and refresh tokens.
- [x] Persists the new session state.
- [x] Invalidates the previous refresh token.

### `POST /api/auth/logout`

- [x] Logs out the authenticated session.
- [x] Clears the push token.
- [x] Invalidates the old access token.

## Bad Paths

### `POST /api/auth/login`

- [x] Rejects invalid request bodies with `400`.
- [x] Rejects wrong credentials with `401`.
- [x] Rejects unknown users with `401`.

### `POST /api/auth/refresh`

- [x] Rejects missing refresh tokens with `401`.
- [x] Rejects invalid refresh tokens with `401`.

### `POST /api/auth/logout`

- [x] Accepts a valid refresh token without requiring an access token.
- [x] Rejects a missing refresh token with `401`.
- [x] Accepts an expired refresh token for push-token cleanup.

## Edge Cases

### Token reuse

- [x] Previous refresh token cannot be reused after rotation.
- [x] Old access token cannot be used after logout.
