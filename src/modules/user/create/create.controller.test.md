# Create User Controller Test Checks

## User Labels

The signup test creates a fresh user and then verifies the DB state for that same user.

## Happy Paths

### `POST /api/users`

- [x] Creates the user.
- [x] Returns `201 Created` with an empty body.
- [x] Confirms the DB row exists.
- [x] Confirms the password is hashed.
- [x] Does not create reminder settings during registration.

## Bad Paths

### `POST /api/users`

- [x] Rejects invalid user payloads with `400`.
- [x] Rejects duplicate users with `400`.

## Edge Cases

### Stored password

- [x] Password is not persisted as plain text.

### New account defaults

- [x] Reminder settings are absent until the user explicitly saves them.
