# Exercises Controller Test Checks

## Happy Paths

### `GET /api/exercises/getall`

- [x] Returns seeded exercises.
- [x] Validates the shared response schema.

## Bad Paths

### `GET /api/exercises/getall`

- [x] Rejects missing auth with `401`.

## Edge Cases

### Seed data shape

- [x] Confirms seeded exercise fields match the shared schema.
