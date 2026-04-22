# Changes Since `v3.2.0`

This document summarizes the main backend changes made after release `v3.2.0` on April 9, 2026, up to the current `HEAD` on April 18, 2026.

The comparison covers 50 commits and reflects a broad architectural shift rather than a small feature batch. The biggest themes are:

- a refactor from Express-first bootstrapping into a NestJS modular monolith
- a cleanup of cross-cutting infrastructure into Nest-managed modules and providers
- a clear separation between local and test database environments
- a move to repo-owned, Postgres-first migrations with Atlas
- a decoupling of the database layer from Supabase-specific schema management

## Executive Summary

Since `v3.2.0`, the backend has been reshaped from a manually wired Express application into a NestJS-based modular system. The server entrypoint, the shared infrastructure layer, the feature modules, and even the worker processes now follow a more consistent dependency-injection model.

In parallel, the database workflow was tightened significantly. Local development and test databases are now separated, database setup is automated through scripts, migrations live inside the repository, and the migration flow is driven directly against PostgreSQL with Atlas instead of relying on Supabase CLI/database ownership patterns.

One important precision point: the database and migration workflow were decoupled from Supabase, but Supabase is still used for storage-related flows such as profile image upload/delete. So this is not a full Supabase removal from the codebase; it is mainly a database/platform decoupling.

## 1. NestJS Refactor

### What changed

Before this work, the backend booted as an Express app with manually registered middleware, route files, and separately initialized infrastructure such as PostgreSQL, Redis, Socket.IO, and background subscribers.

That structure was refactored into a NestJS application:

- `src/app.ts` now defines an `AppModule` and creates the Nest application through `NestFactory`
- feature areas such as `auth`, `user`, `workout`, `messages`, `oauth`, `analytics`, `bootstrap`, `video-analysis`, and others now have Nest modules
- Express route files were removed in favor of Nest controllers and providers
- middleware concerns were converted into Nest middlewares, guards, interceptors, and filters
- the worker entrypoint was also moved into Nest application-context bootstrap logic

### Why the refactor matters

This refactor is bigger than a framework swap. It changes how responsibilities are organized:

- feature code is now grouped around Nest modules instead of being spread across route registration and shared middleware wiring
- dependency injection is now first-class, which makes infrastructure reuse much cleaner
- cross-cutting concerns such as auth, rate limiting, DPoP validation, request logging, error handling, and RLS transaction wrapping are now expressed in Nest-native primitives
- application startup and shutdown are more structured, with explicit shutdown hooks and cleaner lifecycle handling for both API and workers

### What was refactored into Nest

The refactor touched both feature modules and infrastructure modules.

Feature-side changes included:

- controllers replacing route handlers across the API
- services becoming injected providers instead of manually wired helpers
- query classes being injected into services
- auth flows being split into Nest-managed session, password, and verification providers
- tests being adapted to the Nest app bootstrap path

Infrastructure-side changes included:

- `RedisModule` and `RedisService`
- `DBModule` and `DBService`
- `SocketIOModule` and `SocketIOService`
- `CacheModule`
- `AWSModule`
- `MailerModule`
- queue modules for emails and push notifications

The result is a more coherent backend where both request handling and support infrastructure live in the same composition model.

## 2. Middleware, Guards, and Request Lifecycle Cleanup

Several previously shared Express middlewares were migrated into Nest-specific building blocks.

This includes:

- request logging middleware
- bot blocking middleware
- app version enforcement middleware
- general rate limiting middleware
- authentication guard
- authorization guard
- DPoP validation guard
- global exception filter
- request validation pipe

This matters because the request pipeline is now easier to reason about:

- middleware handles request-wide concerns
- guards enforce auth and access control
- pipes validate DTO/request shape
- interceptors handle request-scoped DB behaviors
- filters standardize error responses

One especially important piece here is `RlsTxInterceptor`, which wraps authenticated requests in a database transaction that injects `app.current_user_id` and sets the `authenticated` role. That makes the app-layer identity line up with Postgres Row Level Security in a much cleaner and more repeatable way.

## 3. Database Layer Refactor

### Centralized DB module

The old direct DB client bootstrap flow was replaced by a Nest global `DBModule` and `DBService`.

That change introduced:

- dependency injection for the PostgreSQL client and SQL tag
- a consistent place to initialize and shut down DB resources
- a request-aware SQL proxy that can prefer the current transaction when one exists
- retry behavior for some transient connection failures

### RLS-aware execution model

The database service now uses async local storage to keep track of the request-scoped transaction. In authenticated flows, the backend can open a transaction, set `app.current_user_id`, switch into the `authenticated` role, and then let all downstream queries run within that context.

That is an important architectural improvement because it makes Postgres authorization part of the normal request lifecycle instead of a side concern bolted onto selected queries.

## 4. Environment Separation: Local vs Test Databases

### What changed

A dedicated separation was introduced between local development and test database environments.

The new workflow uses a single `docker-compose.yml` with profiles:

- `postgres_dev` on port `5434`
- `postgres_test` on port `5433`

On top of that, the repo now has explicit scripts for environment setup:

- `npm run db:dev:start`
- `npm run db:dev:migrate`
- `npm run test:db:reset`

### How it works

The script `scripts/setup-local-db.mts` now handles both dev and test orchestration.

For development:

- it starts the dev Postgres container
- applies the committed migration history
- optionally seeds the database

For tests:

- it starts the test Postgres container
- drops and recreates the test database
- reapplies migrations from scratch
- reloads seeds so each test run starts from a predictable state

### Why this matters

This is a meaningful reliability improvement:

- development data is no longer mixed with test execution
- tests no longer depend on a hand-maintained ad hoc DB state
- database resets are reproducible
- migration issues are more likely to surface during normal test execution

The overall effect is that the project now has a much clearer contract between coding, testing, and schema evolution.

## 5. Postgres-First Migrations and Seeds

### Migration ownership moved into the repo

The schema and migration assets were reorganized into:

- `src/infrastructure/db/schema/migrations`
- `src/infrastructure/db/schema/seeds`

That shift is important because the database definition now lives with the application code in a more explicit way.

### Atlas-based migration workflow

The project now includes:

- `atlas.hcl` for the local Atlas environment
- `scripts/create-db-migration.mts` for generating new migrations
- `scripts/apply-prod-migrations.mts` for applying migrations to production

This creates a clearer workflow:

1. make local schema changes against the dev database
2. generate a migration diff with Atlas
3. commit the migration file into the repository
4. apply the same migration history to other environments

### Seeds are now part of the flow

The setup script also applies ordered seed files from `src/infrastructure/db/schema/seeds`.

That means the project now has a more complete database bootstrap process:

- migrations define structure and durable schema changes
- seed files define baseline app data; controller tests create their own user/workout/message fixtures

## 6. Decoupling from Supabase

### What was decoupled

The database and migration workflow were moved away from Supabase-specific management.

This shows up in several ways:

- the Supabase CLI was removed
- migration files were recreated and reorganized as repo-owned SQL migrations
- RLS helper functions and policies were made Postgres-native in the repo
- the project now applies migrations directly to PostgreSQL through Atlas

The new migration set includes a large base schema export plus follow-up migrations for:

- `app.current_user_id()` support
- RLS policy updates to reference app-owned identity state
- message defaults using `app.current_user_id()`
- removal of the older `is_owner_of_workoutsplit` dependency
- grants for the `app` schema

### What was not decoupled

Supabase is still present as the production storage integration.

Profile image upload/delete still goes through `SupabaseStorageService`, and `UserModule` still imports `SupabaseModule` for that purpose. So the current state is best described as:

- database/schema/migrations decoupled from Supabase
- production object storage still using Supabase
- development and test profile-image storage using LocalStack S3

That distinction is worth being explicit about so the refactor is described accurately.

## 7. Infrastructure Refactor Beyond the API

The refactor did not stop at HTTP request handling.

Other notable infrastructure changes include:

- Socket.IO initialization moving into a Nest service with bootstrap lifecycle hooks
- Redis adapter setup for sockets being attached through injected Redis clients
- email and push queues being reorganized into Nest modules
- the mailer being turned into a module/provider pair
- workers moving from standalone bootstrap files into a Nest application context via `workers/entry.ts`
- startup and shutdown logging being standardized across API and workers
- Nest CLI and SWC being introduced for the main server build/run path

Taken together, these changes make the backend feel more like one composed platform instead of a collection of manually wired processes.

## 8. Testing Impact

The test suite was updated repeatedly throughout the refactor, including several follow-up commits just to stabilize startup and test initialization.

The main improvements here are:

- tests now bootstrap against the Nest app path
- test helpers were moved under `src/common/tests`
- the dedicated test database reset flow became part of standard test commands
- the app bootstrap includes special handling to reuse the initialized Nest app in test mode
- controller tests now assert response schemas from `@strong-together/shared`
- controller tests use real local Postgres, Redis/Bull, LocalStack S3/SQS, and Maildev

This is a strong sign that the refactor was not only structural but operational: the project was adapted so the new architecture still supports integration-style tests across the main domains.

## 9. Practical Outcome

From a maintainer's perspective, the backend is now in a much better position for future work.

### The system is more maintainable because

- features are grouped into clear Nest modules
- infrastructure concerns are injectable and reusable
- request lifecycle concerns are expressed in framework-native primitives
- API and worker bootstraps are more consistent
- DB access is more aligned with RLS and environment-aware workflows

### The system is safer to evolve because

- local and test databases are separated
- migrations are versioned in the repo
- production migration application is scripted
- schema changes can be diffed, reviewed, committed, and replayed

### The system is more portable because

- the database layer no longer depends on Supabase-specific tooling for schema evolution
- the app owns more of its infrastructure wiring directly
- the codebase is closer to a platform-agnostic Postgres backend with optional external integrations

## 10. Suggested Short Summary

If you want a short version to reuse in release notes, PR context, or a portfolio description, this is a good one:

> Since `v3.2.0`, the backend was refactored from a manually wired Express server into a NestJS modular monolith, with feature modules, DI-managed infrastructure, Nest-based guards/middleware/interceptors, and a cleaner API/worker bootstrap model. In parallel, the database workflow was redesigned around separate local and test Postgres environments, repo-owned Atlas migrations and seeds, and a Postgres-first schema strategy decoupled from Supabase CLI. Supabase is still used for storage, but the core DB lifecycle is now owned directly by the application.

## 11. Commit Themes by Date

### April 14-17, 2026: NestJS conversion

- Nest installed and bootstrapped into the server
- shared middlewares were refactored into Nest primitives
- feature areas were migrated to controllers/modules/providers
- infrastructure services such as Redis, DB, Socket.IO, mailer, queues, and cache were migrated into Nest-managed modules
- startup, tests, and runtime issues were iteratively fixed until the new architecture stabilized

### April 17, 2026: environment split

- a dedicated testing DB environment was introduced
- test setup was separated more clearly from dev workflows

### April 18, 2026: migration and database workflow cleanup

- schema files were moved into the infrastructure DB area
- Supabase CLI was removed from the DB workflow
- Atlas diff/apply scripts were added
- production migration application was scripted
- migrations and seeds were organized into a repeatable pipeline
- Compose networking was consolidated so local services run on the same shared network
- Nest CLI and SWC were introduced into the run path

## Closing Note

This set of changes is best understood as an architectural foundation release-in-progress rather than a normal iteration. It improves framework consistency, infrastructure composition, database ownership, test isolation, and schema deployment discipline all at once.
