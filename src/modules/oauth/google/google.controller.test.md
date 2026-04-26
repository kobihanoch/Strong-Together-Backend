# Google OAuth Controller Test Checks

## Happy Paths

### None in this file

- [x] Current coverage focuses on validation and rejection paths.

## Bad Paths

### `POST /api/oauth/google`

- [x] Rejects missing `idToken` with `400`.
- [x] Rejects malformed `idToken` through provider verification.

## Edge Cases

### Real provider verification path

- [x] Allows malformed-token failures from the real verification path.
- [x] Accepts either `401` or provider-level `500` from that path.
