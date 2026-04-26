# Password Controller Test Checks

## Happy Paths

### `POST /api/auth/forgotpassemail`

- [x] Finds an existing user.
- [x] Enqueues a Redis-backed password email job.
- [x] Email content includes reset-password URL assets.

### `PUT /api/auth/resetpassword`

- [x] Updates the password hash in DB.
- [x] Stores reset JTI in Redis.
- [x] Allows login with the new password.
- [x] Blocks login with the old password.

## Bad Paths

### Password endpoints

- [x] Reject invalid payloads with `400`.

## Edge Cases

### Missing user forgot-password request

- [x] Keeps the response enumeration-safe.
- [x] Does not reveal whether the email exists.
