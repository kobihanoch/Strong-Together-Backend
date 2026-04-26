# Analytics Controller Test Checks

## User Labels

`User A` means a clean user with no workout data. `User C` means a user with workout/tracking data created during the test.

## Happy Paths

### `GET /api/analytics/get` - User A

- [x] Returns empty analytics.
- [x] Validates the response schema.
- [x] Warms Redis.

### `GET /api/analytics/get` - User C

- [x] Builds analytics from DB-backed workout data.
- [x] Returns aggregate values.
- [x] Validates Redis cache hit on repeated read.

## Bad Paths

### `GET /api/analytics/get`

- [x] Rejects missing auth with `401`.

## Edge Cases

### Empty vs populated analytics

- [x] Empty users get a valid empty shape.
- [x] Users with workouts get computed aggregates.
