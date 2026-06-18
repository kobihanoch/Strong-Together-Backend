# Workout Tracking Controller Test Checks

## User Labels

`User A` means a clean user with no tracking. `User B` means a user with a plan but no tracking. `User C` means a user who finishes a workout during the test.

## Happy Paths

### `GET /api/workouts/gettracking` - User A

- [x] Returns empty tracking.
- [x] Warms Redis.

### `GET /api/workouts/gettracking` - User B

- [x] Handles an existing plan with no tracking.
- [x] Returns a schema-valid empty tracking payload.

### `POST /api/workouts/finishworkout` - User C

- [x] Creates tracking data.
- [x] Persists DB rows.
- [x] Creates a system message.
- [x] Updates Redis cache.

## Bad Paths

### `POST /api/workouts/finishworkout`

- [x] Rejects empty workouts with `400`.
- [x] Avoids DB inserts on failure.

### Workout tracking endpoints

- [x] Reject missing auth with `401`.

## Edge Cases

### Plan without tracking

- [x] Empty tracking response remains schema-valid.

### Failed finish workout

- [x] Invalid finish request leaves DB unchanged.
