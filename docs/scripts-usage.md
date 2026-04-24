# Scripts Usage

This is the practical "what do I run now?" guide for local development, tests, migrations, and production migration operations.

The backend is already deployed in production on Render. These scripts are for local development, local test isolation, and controlled database migration work.

## Start Developing

### First time on the repo

Run this when you cloned the repo or rebuilt your Docker environment:

```bash
npm install
npm run orch:dev
npm run db:dev:start
```

What this gives you:

- full Docker development stack
- Postgres dev database with migrations and seeds
- Redis, Redis queues, persisted LocalStack S3/SQS in dev, Maildev
- Nest API, Node workers, and Python video-analysis service

### Normal daily development

If Docker containers are already healthy:

```bash
npm run orch:dev
```

Use this as the default local startup command. It brings up the API, workers, Redis, Postgres, persisted LocalStack, Maildev, and the Python service from `docker-compose.development.yml`.

### Only refresh the database

Use this after pulling new migrations:

```bash
npm run db:dev:migrate
```

Use this when you want migrations plus seed data:

```bash
npm run db:dev:start
```

## What To Run When

| Situation | Run |
| --- | --- |
| Start normal local development | `npm run orch:dev` |
| First setup or rebuild dev DB with seeds | `npm run db:dev:start` |
| Apply new migrations without reseeding | `npm run db:dev:migrate` |
| Run all tests once | `npm test` |
| Run one domain test suite from scratch | `npm run test:auth`, `npm run test:workouts`, etc. |
| Keep test infra up and rerun exact files | `npm run test:prepare`, then `npm run test:run:*` |
| Create a new DB migration | `npm run db:migrate:diff -- <migration_name>` |
| Apply migrations to production pipeline | `npm run db:prod:migrate` |

## Local Services

Development stack:

| Service | Purpose |
| --- | --- |
| `main-server` | Nest API |
| `background-workers` | email and push workers |
| `python-service` | video-analysis worker |
| `postgres_dev` | dev database |
| `redis` | cache, Redis Pub/Sub, Bull queues |
| `localstack` | persisted local S3/SQS in development |
| `maildev` | local email inbox |
| `atlas` | migration runner |

Useful local URLs:

- RedisInsight: `http://localhost:5540`
- Maildev: `http://localhost:1081`
- S3 explorer: `http://localhost:8082`
- LocalStack: `http://localhost:4566`

## Tests

### Full test run

```bash
npm test
```

This starts the isolated test infrastructure, rebuilds the test database from migrations, runs all suites, and shuts the test stack down.

### One suite

```bash
npm run test:auth
npm run test:workouts
npm run test:videoanalysis
npm run test:websockets
```

The `test:*` scripts run `test:prepare` first, so they are safe to run directly.

### Faster reruns while test infra is already up

```bash
npm run test:prepare
npm run test:run:auth
```

Use `test:run:*` only when the test stack is already running and the test DB is prepared.

### Stop test infra

```bash
npm run test:env:down
```

## Database Migrations

### Create a migration

1. Start the dev stack.
2. Make the schema change in the dev database.
3. Generate the Atlas diff:

```bash
npm run db:migrate:diff -- add_feature_name
```

4. Review the generated SQL in `src/infrastructure/db/schema/migrations`.
5. Apply locally:

```bash
npm run db:dev:migrate
```

6. Prove the clean rebuild:

```bash
npm run test:db:reset
```

### Production migration pipeline

Use this only when you intentionally want to apply committed migrations to the production database pipeline:

```bash
npm run db:prod:migrate
```

Production is hosted on Render, so treat this as an operational command, not a normal local development step.

## Running Without Docker

These scripts start local Node processes directly:

```bash
npm run start:server
npm run start:server:watch
npm run start:workers
npm run start:workers:watch
```

Use them only when Postgres, Redis, LocalStack, and required environment variables are already available. For most local work, prefer `npm run orch:dev`.

## Notes

- Dev and test use separate Compose files and ports.
- Test infra is isolated so it does not overwrite dev data.
- Tests use local Postgres, Redis, Redis queues, ephemeral LocalStack S3/SQS, and Maildev.
- Production providers are not called by local tests.
