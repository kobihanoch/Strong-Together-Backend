# WebSockets Controller Test Checks

## Happy Paths

### `POST /api/ws/generateticket`

- [x] Returns a signed socket ticket.
- [x] Includes socket authorization claims.

## Bad Paths

### `POST /api/ws/generateticket`

- [x] Rejects missing username with `400`.
- [x] Rejects missing auth with `401`.

## Edge Cases

### Ticket claims

- [x] Signed payload includes the data needed for socket authorization.
