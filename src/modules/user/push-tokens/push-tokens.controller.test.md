# Push Tokens Controller Test Checks

## Happy Paths

### `PUT /api/users/pushtoken`

- [x] Persists the push token in DB.
- [x] Returns a schema-valid user response.

## Bad Paths

### `PUT /api/users/pushtoken`

- [x] Rejects bad payloads with `400`.
- [x] Rejects missing auth with `401`.

## Edge Cases

### Response contract

- [x] User response remains schema-valid after token update.
