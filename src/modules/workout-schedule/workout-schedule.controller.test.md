# Workout Schedule Controller Tests

- Returns an empty, contract-valid schedule for a new user.
- Replaces the complete schedule and returns entries ordered by weekday and time.
- Removes omitted entries during replacement and clears all entries with `schedules: []`.
- Rejects missing fields, invalid weekdays/times, duplicate split/day entries, and splits owned by another user.
- Rejects unauthenticated reads and writes.
