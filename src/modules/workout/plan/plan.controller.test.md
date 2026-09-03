# Workout Plan Controller Test Checks

## User Labels

`User A` means a clean user with no workout plan. `User B` means a user whose plan is created during the test.

## Happy Paths

### `GET /api/workout-plan` - User A

- [x] Returns an empty workout plan.
- [x] Warms Redis.

### `PUT /api/workout-plan` - User B

- [x] Creates a workout plan.
- [x] Returns `204 No Content`.
- [x] Confirms DB rows exist.
- [x] Deletes directly affected cache keys.

### Repeated `PUT /api/workout-plan` - User B

- [x] Renames and reorders splits carrying IDs.
- [x] Creates a new split when its ID is omitted.
- [x] Preserves split IDs.
- [x] Returns `204 No Content`.

## Bad Paths

### `PUT /api/workout-plan`

- [x] Rejects invalid empty splits with `400`.

### Workout plan endpoints

- [x] Reject missing auth with `401`.

## Edge Cases

### Repeated plan read

- [x] The first read rebuilds the deleted cache entry and the repeated read is a Redis hit.

### Empty plan

- [x] Empty plan response keeps the expected shape.
