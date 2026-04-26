# Bootstrap Controller Test Checks

## Happy Paths

### `GET /api/bootstrap/get` - base payload

- [x] Returns the bootstrap response.
- [x] Updates the user's timezone in DB.
- [x] Caches the timezone in Redis.

### `GET /api/bootstrap/get` - populated payload

- [x] Includes workout data.
- [x] Includes tracking data.
- [x] Includes message data.
- [x] Includes aerobics data.
- [x] Validates the shared response schema.

## Bad Paths

### `GET /api/bootstrap/get`

- [x] Rejects missing auth with `401`.

## Edge Cases

### Empty account bootstrap

- [x] Returns valid empty module payloads.
- [x] Preserves the expected response shape.
