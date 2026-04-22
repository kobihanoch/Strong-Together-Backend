# Scripts Usage

This file is the quickest reference for the scripts you will use most often.

## Local Development

Use these when working on the normal local stack:

| Script | What it does |
| --- | --- |
| `npm run orch:dev` | Starts the full development Docker stack from `docker-compose.development.yml`. |
| `npm run db:dev:start` | Starts the dev Postgres service, applies migrations, and injects seeds. |
| `npm run db:dev:migrate` | Starts the dev Postgres service and applies migrations without reseeding. |
| `npm run start:server` | Starts the Nest API once. |
| `npm run start:server:watch` | Starts the Nest API in watch mode. |
| `npm run start:workers` | Starts the Node background workers once. |
| `npm run start:workers:watch` | Starts the Node background workers in watch mode. |

## Testing

Use these for the isolated test environment:

| Script | What it does |
| --- | --- |
| `npm run test:env:up` | Starts the test infra stack from `docker-compose.test.yml`. |
| `npm run test:env:down` | Stops the test infra stack. |
| `npm run test:db:reset` | Rebuilds the test database, applies migrations, and injects baseline seeds. |
| `npm run test:prepare` | Brings test infra up and resets the test DB once. |
| `npm run test` | Runs the full test flow with one infra startup at the beginning and one shutdown at the end. |
| `npm run test:watch` | Starts test infra, resets the test DB, then runs Vitest in watch mode. |

### Single-Suite Scripts

These are useful when you want one focused module:

- `npm run test:auth`
- `npm run test:users`
- `npm run test:workouts`
- `npm run test:bootstrap`
- `npm run test:messages`
- `npm run test:aerobics`
- `npm run test:analytics`
- `npm run test:exercises`
- `npm run test:oauth`
- `npm run test:push`
- `npm run test:videoanalysis`
- `npm run test:websockets`

Under the hood, each of these runs `test:prepare` first so it can be executed on its own.

The matching `test:run:*` scripts skip preparation and run exact controller test files. Use them only after `npm run test:prepare` or while the test stack is already up.

## Migrations

| Script | What it does |
| --- | --- |
| `npm run db:migrate:diff -- <migration_name>` | Generates a new Atlas migration diff against the dev DB. |
| `npm run db:prod:migrate` | Applies committed migrations to the production DB pipeline. |

## Typical Flows

### Start a normal local work session with Compose

```bash
npm install
npm run orch:dev
```

Use the DB scripts separately only when you want database preparation without booting the whole stack.

### Prepare only the local database

```bash
# Apply migrations only
npm run db:dev:migrate

# Apply migrations and seed data
npm run db:dev:start
```

### Run the full integration test stack once

```bash
npm run test
```

### Reset only the test DB while keeping test infra available

```bash
npm run test:env:up
npm run test:db:reset
```

## Notes

- Dev and test use different Compose files and different ports.
- Test infra is intentionally isolated so it does not overwrite your dev data.
- The test stack is infra-only. Vitest boots the Nest app in-process during tests.
- Controller tests create their own users and clean them up; seeds provide only baseline data such as system users/exercises.
- Tests use real local Postgres, Redis, LocalStack S3/SQS, and Maildev. Production providers such as Resend and Supabase Storage are not called by tests.
