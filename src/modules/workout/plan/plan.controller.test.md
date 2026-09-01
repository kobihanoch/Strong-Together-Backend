# Workout Plan Controller Test Checks

## User Labels

`User A` means a clean user with no workout plan. `User B` means a user whose plan is created during the test.

## Happy Paths

### `GET /api/workout-plan` - User A

- [x] Returns an empty workout plan.
- [x] Warms Redis.

### `PUT /api/workout-plan` - User B

- [x] Creates a workout plan.
- [x] Validates the response schema.
- [x] Confirms DB rows exist.
- [x] Updates Redis.

### Repeated `PUT /api/workout-plan` - User B

- [x] Renames and reorders splits carrying IDs.
- [x] Creates a new split when its ID is omitted.
- [x] Preserves split IDs.
- [x] Validates the response schema.

## Bad Paths

### `PUT /api/workout-plan`

- [x] Rejects invalid empty splits with `400`.

### Workout plan endpoints

- [x] Reject missing auth with `401`.

## Edge Cases

### Repeated plan read

- [x] User B plan can be served from Redis on repeated reads.

### Empty plan

- [x] Empty plan response keeps the expected shape.
