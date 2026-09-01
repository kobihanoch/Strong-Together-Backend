# Aerobics Controller Test Checks

## Happy Paths

### `GET /api/aerobics`

- [x] Returns an empty schema-valid aerobics payload.
- [x] Warms Redis with the aerobics response.

### `POST /api/aerobics`

- [x] Persists the aerobic record.
- [x] Returns updated daily and weekly aggregates.
- [x] Updates Redis with the refreshed aerobics response.

## Bad Paths

### `POST /api/aerobics`

- [x] Rejects invalid payloads with `400`.

### `GET` / `POST /api/aerobics/*`

- [x] Rejects missing auth with `401`.

## Edge Cases

### Repeated `GET`

- [x] First request warms Redis.
- [x] Second request returns a Redis `HIT`.
