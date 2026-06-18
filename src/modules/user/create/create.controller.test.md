# Create User Controller Test Checks

## User Labels

The signup test creates a fresh user and then verifies the DB state for that same user.

## Happy Paths

### `POST /api/users/create`

- [x] Creates the user.
- [x] Validates the response schema.
- [x] Confirms the DB row exists.
- [x] Confirms the password is hashed.
- [x] Creates reminder settings.

## Bad Paths

### `POST /api/users/create`

- [x] Rejects invalid user payloads with `400`.
- [x] Rejects duplicate users with `400`.

## Edge Cases

### Stored password

- [x] Password is not persisted as plain text.

### New account defaults

- [x] Reminder settings are created during signup.
