# Workout Tracking Controller Test Checks

## User Labels

`User A` means a clean user with no tracking. `User B` means a user with a plan but no tracking. `User C` means a user who finishes a workout during the test.

## Happy Paths

### `GET /api/workout-history` - User A

- [x] Returns empty tracking.
- [x] Warms Redis.

### `GET /api/workout-history` - User B

- [x] Handles an existing plan with no tracking.
- [x] Returns a schema-valid empty tracking payload.

### `GET /api/exercise-history` - grouped exercise history

- [x] Groups tracking by `exerciseToSplitId`.
- [x] Omits duration and the `exerciseTracking` wrapper.
- [x] Orders exercise history newest first.
- [x] Returns and refreshes its dedicated cache entry.

### `GET /api/personal-records` - all personal records

- [x] Returns the same PR object shape used by workout statistics.
- [x] Returns all current exercise PRs keyed by exercise ID.
- [x] Reads and warms the dedicated personal-records cache on demand.

### `POST /api/workout-sessions` - User C

- [x] Creates tracking data.
- [x] Persists DB rows.
- [x] Creates a system message.
- [x] Deletes the directly affected cache keys.
- [x] Returns `204 No Content`.

## Bad Paths

### `POST /api/workout-sessions`

- [x] Rejects empty workouts with `400`.
- [x] Avoids DB inserts on failure.

### Workout tracking endpoints

- [x] Reject missing auth with `401`.

## Edge Cases

### Plan without tracking

- [x] Empty tracking response remains schema-valid.

### Failed finish workout

- [x] Invalid finish request leaves DB unchanged.
