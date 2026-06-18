# Apple OAuth Controller Test Checks

## Happy Paths

### None in this file

- [x] Current coverage focuses on validation and rejection paths.

## Bad Paths

### `POST /api/oauth/apple`

- [x] Rejects missing `idToken` with `400`.
- [x] Rejects invalid email shape with `400`.

## Edge Cases

### Provider payload validation

- [x] Validates email format before accepting Apple auth data.
