# Migrations And DB Pipeline

This project uses a repo-owned PostgreSQL migration flow built around Atlas.

## Source Of Truth

The database pipeline is based on committed files inside the repo:

- Migrations: [`src/infrastructure/db/schema/migrations`](../src/infrastructure/db/schema/migrations)
- Seeds: [`src/infrastructure/db/schema/seeds`](../src/infrastructure/db/schema/seeds)

## Environment Split

The local database pipeline is now split by environment:

| Environment | Compose file | Container | Host port | Persistence |
| --- | --- | --- | --- | --- |
| Development | `docker-compose.development.yml` | `strongtogether_postgres_dev` | `5434` | Persistent Docker volume |
| Test | `docker-compose.test.yml` | `strongtogether_postgres_test` | `5433` | Ephemeral `tmpfs` |

That gives you two important guarantees:

- local dev data can stay stable between sessions
- test runs can start from a clean database without touching dev data

## Dev DB Pipeline

`npm run db:dev:start` does the following:

1. starts `postgres_dev`
2. waits for the database healthcheck
3. applies all committed migrations
4. injects seed files

`npm run db:dev:migrate` is the same flow without reseeding.

Use that when you want schema updates on your current local DB without replaying fixture users and test content.

## Test DB Pipeline

`npm run test:db:reset` does the following:

1. starts `postgres_test`
2. terminates active client connections to the test DB
3. drops the existing test database
4. recreates the test database
5. applies all committed migrations from scratch
6. injects seed files

This makes the test DB deterministic and disposable.

## Creating A New Migration

Generate a new migration diff with:

```bash
npm run db:migrate:diff -- add_some_change
```

That script:

1. ensures the dev Postgres service is running
2. uses Atlas inside Docker
3. diffs the current DB state into a new committed migration file

## Recommended Workflow

### Normal schema change

```bash
npm run db:dev:start
npm run db:migrate:diff -- add_new_table
npm run db:dev:migrate
npm run test:db:reset
```

### Before opening a PR

```bash
npm run test
```

That validates the migration history against a clean test database and also exercises the API/infrastructure integration tests.

## Seeds

Seeds are intended for local environments and test bootstrap.

Use seeds when you want:

- known users for local development
- known baseline data for integration tests
- deterministic app flows without manual setup

Be aware:

- dev seeds write into the persistent dev DB
- test seeds write into the disposable test DB

## Why This Pipeline Matters

This structure keeps schema changes predictable:

- dev reflects the real migration history
- test proves migrations can rebuild a fresh DB from zero
- migration files remain first-class repo artifacts instead of hidden local state
