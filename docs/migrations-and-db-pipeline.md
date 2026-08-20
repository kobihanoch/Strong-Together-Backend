# Migrations And DB Pipeline

This project uses a repo-owned PostgreSQL migration flow built around Drizzle.

## Source Of Truth

The database pipeline is based on committed files inside the repo:

- Drizzle schema: [`src/infrastructure/db/schema/drizzle`](../src/infrastructure/db/schema/drizzle)
- Active migrations: [`src/infrastructure/db/schema/drizzle-migrations`](../src/infrastructure/db/schema/drizzle-migrations)
- Archived Atlas history: [`src/infrastructure/db/schema/migrations`](../src/infrastructure/db/schema/migrations)
- Seeds: [`src/infrastructure/db/schema/seeds`](../src/infrastructure/db/schema/seeds)

The Drizzle `0000_baseline.sql` migration represents the database state after the
last archived Atlas migration. New schema changes must be generated with Drizzle.

Drizzle schema files are also the source of truth for tables and RLS policies. PostgreSQL routines, explicit grants, revokes, and schemas such as `guest_api` are reviewed SQL additions inside the generated migration because Drizzle Kit does not fully model those objects.

Reviewed ERD sources live in `docs/db-diagrams/source`. After a Drizzle table/view change, update the corresponding DBML and run `npm run docs:db-diagrams`. The renderer overwrites the existing SVG filenames so all Markdown injections remain stable.

## Environment Split

The local database pipeline is now split by environment:

| Environment | Compose file | Container | Host port | Persistence |
| --- | --- | --- | --- | --- |
| Development | `docker-compose.development.yml` | `strongtogether_postgres_drizzle_dev` | `5435` | Persistent Docker volume |
| Test | `docker-compose.test.yml` | `strongtogether_postgres_test` | `5433` | Ephemeral `tmpfs` |

That gives you two important guarantees:

- local dev data can stay stable between sessions
- test runs can start from a clean database without touching dev data

## Dev DB Pipeline

`npm run db:dev:start` does the following:

1. starts `postgres_drizzle_dev`
2. waits for the database healthcheck
3. applies all committed migrations
4. injects seed files that are not recorded in `drizzle.__seed_history`

`npm run db:dev:migrate` applies migrations without running the seed pipeline.

Use that when you want schema updates on your current local DB without replaying seed data.

## Test DB Pipeline

`npm run test:db:reset` does the following:

1. starts `postgres_test`
2. terminates active client connections to the test DB
3. drops the existing test database
4. recreates the test database
5. applies all committed migrations from scratch
6. injects baseline seed files

This makes the test DB deterministic and disposable. Development and test use
the same Drizzle migration directory and seed runner; only their database names,
ports, persistence, and reset behavior differ.

Database recreation, migration, and seeding use the administrator URL. The Nest application under test uses `app_runtime_user`; direct test fixture helpers intentionally use the administrator URL.

## Creating A New Migration

Generate a new migration diff with:

```bash
npm run db:migrate:diff -- add_some_change
```

That command:

1. reads the committed Drizzle TypeScript schema
2. compares it with the latest Drizzle snapshot
3. writes a new migration and snapshot when the schema changed

After generation, review the SQL. If the change includes routines or privilege boundaries, add the required `CREATE FUNCTION`, `REVOKE`, and explicit `GRANT EXECUTE` statements to that migration. Never grant guest access with `GRANT ... ON ALL TABLES` or a permissive guest RLS policy.

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

- known app/system data for local development
- known baseline data for integration tests
- deterministic app flows without manual setup

Be aware:

- dev seeds write into the persistent dev DB
- test seeds write into the disposable test DB
- applied seed filenames are tracked in `drizzle.__seed_history`, so setup can be rerun safely
- controller tests create and clean up their own users, workouts, messages, and profile data

## Why This Pipeline Matters

This structure keeps schema changes predictable:

- dev reflects the real migration history
- test proves migrations can rebuild a fresh DB from zero
- migration files remain first-class repo artifacts instead of hidden local state
