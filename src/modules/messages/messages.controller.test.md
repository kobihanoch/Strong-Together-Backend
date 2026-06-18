# Messages Controller Test Checks

## User Labels

`User A` means a clean user with no messages. Other users are populated by setup flows inside the test.

## Happy Paths

### `GET /api/messages/getmessages` - User A

- [x] Returns an empty messages list.
- [x] Validates the response schema.

### `GET /api/messages/getmessages` - workout flow

- [x] Creates a system message through the workout DB flow.
- [x] Returns the generated system message.

### `PUT /api/messages/markasread/:id`

- [x] Updates message read state in DB.

### `DELETE /api/messages/delete/:id`

- [x] Deletes the message row from DB.

## Bad Paths

### Message endpoints

- [x] Reject bad requests with `400`.
- [x] Reject missing auth with `401`.
- [x] Return `404` for missing resources.

## Edge Cases

### Empty inbox

- [x] Empty message list still matches the expected schema.
