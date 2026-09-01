# Push Controller Test Checks

## Happy Paths

### `POST /api/push-jobs/daily`

- [x] Enqueues Redis-backed push notification jobs.

### `POST /api/push-jobs/hourly-reminders`

- [x] Reads reminder state from DB.
- [x] Enqueues delayed reminder jobs.

## Bad Paths

### None in this file

- [x] Current coverage focuses on successful scheduler-style enqueue flows.

## Edge Cases

### Delayed reminders

- [x] Delay is derived from persisted reminder state.
