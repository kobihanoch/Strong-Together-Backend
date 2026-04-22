# Testing Policy

Strong Together uses Vitest and Supertest to test the NestJS API against real local infrastructure. The test suite is closer to integration testing than isolated unit testing, which is the right tradeoff for this backend because much of the risk lives in contracts, authentication, RLS, migrations, Redis, S3/SQS emulation, and cross-module behavior.

## Test Types Present In The Repo

| Type | Evidence | Purpose |
| --- | --- | --- |
| Controller/API integration tests | `src/modules/**/*.controller.test.ts` | Exercise HTTP routes through the Nest application and Supertest |
| Contract tests | shared schema assertions such as `expectSchema(loginResponseSchema, response.body)` | Detect drift from `@strong-together/shared` response contracts |
| Auth/security behavior tests | `session.controller.test.ts`, password and verification tests | Validate token rotation, logout invalidation, reset flows, and protected-route behavior |
| Domain integration tests | workouts, tracking, aerobics, analytics, messages, users | Validate SQL/query behavior through the real app stack |
| Infrastructure-facing tests | video-analysis, websockets, push, profile image flows | Validate S3/Redis/WebSocket-adjacent behavior using local test infrastructure |

The repo currently does not emphasize isolated unit tests. That is acceptable here because the service surface is database and infrastructure heavy; integration coverage provides higher confidence than mocking every adapter.

## Test Runner Configuration

`vitest.config.ts` configures:

- Node environment.
- Setup file: `src/common/tests/setup/test-setup.ts`.
- Test include pattern: `src/modules/**/*.test.ts`.
- Thread pool with `maxWorkers: 1`.
- `fileParallelism: false`.
- `testTimeout: 10000`.

Serial execution is a deliberate isolation decision. Many tests share disposable infrastructure and database state. Running them one at a time reduces false negatives from concurrent mutation, token-version races, and shared Redis/S3 test resources.

## Environment Isolation

Tests use `docker-compose.test.yml`, which provides:

- `postgres_test` on host port `5433`
- `redis_test` on host port `6380`
- `localstack_test` on host port `4567`
- `maildev_test` on host ports `1025` and `1080`
- RedisInsight test UI on host port `5541`
- Atlas migration container

The test database and Redis data are mounted on `tmpfs`. That makes the environment disposable by default and prevents accidental coupling to local development data.

## Database Reset Strategy

`npm run test:prepare` runs:

```bash
npm run test:env:up
npm run test:db:reset
```

`test:db:reset` rebuilds the database by:

1. terminating active connections
2. dropping `strongtogether_test`
3. recreating `strongtogether_test`
4. applying committed Atlas migrations
5. injecting seed SQL

This proves the migration history can bootstrap a clean environment before tests run. That is more valuable than testing against a hand-mutated local database.

## Shared Helpers

`src/common/tests/helpers` contains reusable setup and assertions for:

- auth headers and token flows
- users and OAuth
- workouts and tracking
- messages
- analytics and aerobics
- exercises
- video analysis
- websockets
- infrastructure and database cleanup

Those helpers keep tests focused on behavior while still going through real HTTP and persistence paths.

## Running Tests

Full suite:

```bash
npm test
```

Focused suites:

```bash
npm run test:auth
npm run test:users
npm run test:workouts
npm run test:analytics
npm run test:videoanalysis
npm run test:websockets
```

Raw route groups can be run without recreating the environment by using the `test:run:*` scripts after `test:prepare`.

## Policy For New Tests

Add integration coverage when a change touches:

- authentication, token lifecycle, or DPoP behavior
- RLS-sensitive queries
- request/response contracts from `@strong-together/shared`
- migrations or schema ownership
- S3/SQS/Redis/Socket.IO handoffs
- worker-triggered side effects

Add focused unit tests when:

- logic is pure and high-branching
- a bug was caused by a calculation or parser
- the behavior does not need the Nest app or database to be meaningful

The default standard is: if a recruiter or lead reviewer asks whether a user-facing flow works end to end, there should be an integration test that proves it.
