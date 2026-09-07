# Messages Controller Test Checks

## User Labels

`User A` means a clean user with no messages. Other users are populated by setup flows inside the test.

## Happy Paths

### `GET /api/messages` - User A

- [x] Returns an empty messages list.
- [x] Validates the response schema.

### `GET /api/messages` - persisted message

- [x] Returns a persisted system message without coupling the fixture to workout completion.

### `PATCH /api/messages/:id/read`

- [x] Updates message read state in DB.
- [x] Returns `204 No Content`.

### `DELETE /api/messages/:id`

- [x] Deletes the message row from DB.
- [x] Returns `204 No Content`.

## Bad Paths

### Message endpoints

- [x] Reject bad requests with `400`.
- [x] Reject missing auth with `401`.
- [x] Return `404` for missing resources.

## Edge Cases

### Empty inbox

- [x] Empty message list still matches the expected schema.
