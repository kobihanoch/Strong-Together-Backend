# Push Controller Test Checks

## Happy Paths

### `POST /api/push-jobs/workout-reminders`

- [x] Accepts a JWT signed with the configured cron secret and runs the enqueue flow.

## Bad Paths

### `POST /api/push-jobs/workout-reminders`

- [x] Rejects requests without a cron JWT.
