# Database Independence Migration Plan

## Goal

Move the project from a Supabase-centered database workflow to a Postgres-first workflow.

Supabase will be treated only as a production Postgres host, not as:

- the source of truth for schema changes
- the database editor
- the migration engine
- the auth/RLS abstraction layer

The long-term source of truth will be SQL files stored in this repository.

## Current Situation

Today the project already uses direct Postgres access in the backend through `DATABASE_URL`.
That means the application is not deeply coupled to Supabase at the query layer.

The real remaining coupling is at the database schema layer:

- Supabase-generated schema history
- Supabase-specific helper functions such as `auth.uid()`
- Supabase roles and grants such as `authenticated`
- legacy Supabase schemas and tables that are not part of the actual business domain
- local development and test workflows driven by Supabase CLI

## Target Architecture

The target architecture is:

- local development uses a regular Postgres container
- tests use a regular Postgres container or disposable Postgres databases
- pgAdmin becomes the main GUI database editor
- Atlas is used to generate migration diffs
- SQL migrations in the repository become the only source of truth
- the backend continues to use raw SQL queries
- RLS continues to exist, but it will rely on our own roles and helper functions instead of Supabase auth helpers
- production may still remain hosted on Supabase Postgres, but only as an infrastructure host

## Guiding Principles

1. Postgres is the product we build on.
2. SQL is the source of truth.
3. GUI editing is allowed, but every schema change must end up as a reviewed SQL migration in git.
4. Production migrations must be generated and owned by us, not by Supabase tooling.
5. We should not perform destructive cleanup on the Supabase-hosted production database until the new architecture is fully in place and verified.

## Recommended Tooling

### Local Database Runtime

- Dockerized PostgreSQL
- pgAdmin for GUI editing and inspection

### Migration Workflow

- Atlas for diff-based SQL migration generation

### Application Access

- Keep the current direct Postgres access pattern
- Keep SQL queries in the application
- Do not introduce Prisma as the main schema authority for this project

## Why Not Prisma As The Main Direction

Prisma is great when the application wants an ORM-centered workflow.
This project is different because it depends on:

- SQL-first development
- Row Level Security
- custom roles and grants
- database functions
- triggers
- advanced Postgres behavior

For this type of system, Prisma would likely add abstraction without solving the real database ownership problem.

## Development Workflow

### Future Day-To-Day Flow

1. Start the local Postgres container.
2. Open the database in pgAdmin.
3. Make schema changes in pgAdmin.
4. Use Atlas to generate a SQL migration diff from the local database changes.
5. Review and clean up the generated migration if needed.
6. Commit the migration to git.
7. Rebuild the database from scratch using bootstrap scripts, migrations, and seeds.
8. Verify that the schema is reproducible without manual GUI edits.

### Important Rule

pgAdmin is the editor.
Atlas is the migration history tool.
Git is the source of truth.

pgAdmin must never become the only place where schema changes live.

## Production Workflow

### Desired Flow

1. Develop and validate changes locally.
2. Generate SQL migrations locally.
3. Test that a fresh database can be built from those migrations.
4. Apply the same SQL migrations to production.

### Important Clarification

We should not rely on `supabase diff` as the main deployment mechanism.

Once this migration plan is complete, production deploys should work like standard Postgres deploys:

- apply our SQL migrations to the production `DATABASE_URL`
- treat Supabase only as the remote Postgres host

## Test Database Strategy

The desired test behavior is:

- tests start from a clean schema
- test seeds are loaded automatically
- test data is isolated
- the database is reset between test runs

Recommended approach:

- maintain a dedicated local Postgres test database
- build it from bootstrap SQL, migrations, and test seeds
- reset it before each suite or each run
- only move to per-test full rebuilds if required by test isolation needs

Rebuilding the entire database after every single test case may be possible, but it is usually slower and not always necessary.

## Supabase Dependency Reduction Strategy

This must happen in stages.

### Stage 1: Stop Using Supabase As A Workflow Tool

Goals:

- stop relying on Supabase CLI as the main local database workflow
- move local development to standard Postgres
- move test execution to standard Postgres
- keep current schema behavior working

At this stage, compatibility with the existing schema is more important than aggressive cleanup.

### Stage 2: Replace Supabase Auth/RLS Coupling

Goals:

- stop depending on `auth.uid()`
- stop depending on Supabase auth tables
- stop depending on Supabase-specific RLS assumptions

Introduce our own:

- application roles such as `anonymous`, `authenticated`, and `app_service`
- helper functions such as `app.current_user_id()`
- session variables controlled by our backend

Example direction:

Instead of:

```sql
USING (user_id = auth.uid())
```

Move toward:

```sql
USING (user_id = app.current_user_id())
```

Where `app.current_user_id()` reads from a session setting that the backend writes at request time.

### Stage 3: Selective Schema Cleanup

Only after the application no longer depends on Supabase auth helpers should we consider removing Supabase-specific objects from local development.

Even then, cleanup must be separated into:

- local-only cleanup
- shared migrations that are safe for production

## Important Safety Rule For Production

If we remove Supabase-owned or Supabase-created schemas and tables locally, and then apply those same destructive migrations to the production database hosted on Supabase, production will attempt to remove them too.

That means:

- local cleanup is not automatically safe for production
- destructive cleanup must not be mixed blindly into shared production migrations

For the near term, we should prefer:

- leaving unused Supabase-managed structures alone in production
- removing workflow dependency first
- removing logical dependency second
- considering physical deletion from production only after careful verification

## What Should Become Ours

Over time, the following should belong fully to us:

- all business tables
- all policies
- all roles used by the application
- all helper functions used by the application
- all grants needed by the application
- all migrations
- all seeds

## What Supabase Should Remain Responsible For

Only infrastructure hosting, if we keep using it for production.

That means Supabase may continue to provide:

- hosted Postgres
- backups
- operational hosting features

But not:

- schema ownership
- migration ownership
- auth ownership for our RLS model

## Greenfield Project Recommendation

For a new project with requirements similar to this one:

- start with Postgres from day one
- use pgAdmin as the GUI editor
- use Atlas for migration diffs
- keep SQL as the source of truth
- design custom roles and RLS helpers from the beginning
- avoid introducing Supabase-specific auth/database coupling unless those services are explicitly required

Prisma may still be a good choice for simple CRUD systems, but it is not the default recommendation for a Postgres-first, RLS-heavy system.

## Proposed Implementation Phases

### Phase 1: Documentation And Inventory

- map all current Supabase-specific schema dependencies
- identify every use of `auth.uid()` and related helpers
- identify existing roles, grants, policies, functions, and schemas
- define the target custom auth/RLS model

### Phase 2: Local Postgres Environment

- create Docker-based local Postgres setup
- add pgAdmin container
- define environment variables for local dev and test
- verify application connectivity without Supabase CLI

### Phase 3: Bootstrap Layer

- create bootstrap SQL for required roles
- create bootstrap SQL for required helper schemas
- create custom helper functions such as `app.current_user_id()`
- ensure RLS can work through backend-controlled session settings

### Phase 4: Migration Workflow

- configure Atlas
- define migration directories
- define reset/rebuild scripts
- verify clean rebuild from zero

### Phase 5: RLS Refactor

- replace Supabase helper usage in policies and functions
- update backend session configuration where needed
- verify all protected flows still work

### Phase 6: Test Workflow

- build dedicated test database flow
- add deterministic test seed loading
- automate database reset between test runs
- optimize for speed if needed

### Phase 7: Production Rollout

- apply only safe, owned migrations to production
- keep destructive cleanup out of production until verified
- validate behavior on the Supabase-hosted Postgres database

### Phase 8: Optional Production Cleanup

- review which Supabase-created objects are still unused
- decide whether they should remain untouched or be removed
- only perform deletions after explicit verification and backups

## Success Criteria

The migration will be considered successful when:

- local development no longer depends on Supabase CLI
- tests no longer depend on Supabase CLI
- schema changes are made locally and captured as SQL migrations
- production uses the same migration chain as local
- the backend no longer relies on Supabase auth helpers for RLS
- Supabase is only a Postgres host, not a schema platform dependency

## Short Summary

The plan is not to replace SQL with an ORM.
The plan is to take ownership of the database as a normal Postgres system.

The future workflow is:

- edit locally in pgAdmin
- generate SQL migrations with Atlas
- store migrations in git
- rebuild from scratch locally
- apply the same migrations to production

Supabase becomes optional infrastructure.
Postgres becomes the real platform.
