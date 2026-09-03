# Aerobics Controller Test Checks

## Happy Paths

### `GET /api/aerobics`

- [x] Returns an empty schema-valid aerobics payload.
- [x] Warms Redis with the aerobics response.

### `POST /api/aerobics`

- [x] Persists the aerobic record.
- [x] Deletes the exact affected cache key.
- [x] Returns `204 No Content`.

### `PUT /api/aerobics/:id`

- [x] Updates an owned aerobic entry.
- [x] Deletes the exact affected cache key and returns `204 No Content`.

### `DELETE /api/aerobics/:id`

- [x] Deletes an owned aerobic entry.
- [x] Deletes the exact affected cache key and returns `204 No Content`.

## Bad Paths

### `POST /api/aerobics`

- [x] Rejects invalid payloads with `400`.

### `PUT` / `DELETE /api/aerobics/:id`

- [x] Returns `404` for missing or non-owned entries.

### `GET` / `POST /api/aerobics/*`

- [x] Rejects missing auth with `401`.

## Edge Cases

### Repeated `GET`

- [x] First request warms Redis.
- [x] Second request returns a Redis `HIT`.
