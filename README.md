# Strong Together Backend (v4.0.0)

[![CI](https://github.com/kobihanoch/Strong-Together-Backend/actions/workflows/ci.yml/badge.svg)](https://github.com/kobihanoch/Strong-Together-Backend/actions)

This is the backend for **Strong Together**.

- Backend repository: [Strong-Together-Backend](https://github.com/kobihanoch/Strong-Together-Backend)
- Frontend repository: [Strong-Together-App](https://github.com/kobihanoch/Strong-Together-App)

It powers authentication, workout planning, progress tracking, realtime messaging, push notifications, and asynchronous exercise video analysis.
The project is a **NestJS server** that combines a TypeScript API, background workers, Redis-based async infrastructure, a Python computer-vision service, and a PostgreSQL schema designed for analytics-heavy fitness flows.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Amazon SQS](https://img.shields.io/badge/Amazon%20SQS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FF6F00?style=for-the-badge&logo=google&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=typescript&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![Pino](https://img.shields.io/badge/Pino-FFD43B?style=for-the-badge&logo=javascript&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## TL;DR

A backend platform with:

- a **NestJS server** built as a **modular monolith** for the main API and worker bootstrapping
- async video processing using **Node.js**, **Python**, **Redis**, and **AWS S3** using **SQS**
- secure authentication using **JWT**, **DPoP**, and **rate limits**
- realtime communication using **Socket.IO**
- a **PostgreSQL-first** schema and migration workflow with **Atlas**
- separated **development** and **test** database environments
- **GitHub Actions CI pipeline** that runs the automated test suite on pushes and pull requests targeting `main`.

## Highlights

- **NestJS modular architecture**: the backend is organized into feature modules such as auth, users, workouts, messages, OAuth, analytics, video analysis, and websockets, with Nest controllers, services, guards, interceptors, and providers.
- **Infrastructure as modules**: Redis, PostgreSQL, Socket.IO, cache, AWS, mailer, and queue integrations are now composed as Nest-managed infrastructure modules.
- **Authentication and request protection**: **JWT**, **DPoP proof-of-possession**, **rate limits**, bot blocking, token rotation, and request validation are handled through the current request pipeline.
- **Request contracts**: request schemas are consumed from the shared package and validated at the API boundary before controller logic runs.
- **Async media pipeline**: **direct AWS S3 uploads**, **S3 event-driven SQS dispatch**, Python-based CV analysis, **trace-aware async orchestration**, and **realtime result delivery** back to the client.
- **Database design**: **PostgreSQL**, analytics views, normalized workout tracking, reminder intelligence, indexing strategy, **RLS-aware** patterns, and repo-owned migrations/seeds.
- **Test coverage**: **Vitest + Supertest** integration tests across auth, workouts, analytics, OAuth, websockets, and video analysis.
- **Observability**: **Pino structured logs**, **Sentry tracing**, request IDs, and service-aware error handling.

## Table of Contents

1. [TL;DR](#tldr)
2. [Highlights](#highlights)
3. [Architecture](#architecture)
   1. [Video Analysis Architecture](#video-analysis-architecture)
4. [Folder Tree](#folder-tree)
5. [Tech Stack](#tech-stack)
6. [Request Pipeline](#request-pipeline)
   1. [Pipeline Layers](#pipeline-layers)
   2. [Why it matters](#why-it-matters)
7. [Run Locally](#run-locally)
   1. [Docker setup](#docker-setup)
8. [Testing](#testing)
   1. [CI](#ci)
9. [Database Overview](#database-overview)
10. [Key database design choices](#key-database-design-choices)
11. [Database workflow](#database-workflow)
12. [Important tables and objects](#important-tables-and-objects)
13. [DB files](#db-files)
14. [Database Schema](#database-schema)
15. [Workout tracking model](#workout-tracking-model)
16. [Database Flows](#database-flows)
17. [Workout Flow](#workout-flow)
18. [Tracking Flow](#tracking-flow)
19. [Messages Flow](#messages-flow)
20. [Auth Flow](#auth-flow)
21. [Reminder Flow](#reminder-flow)

## Architecture

The Node backend is now structured as a **NestJS modular monolith** built around feature modules and infrastructure modules.

At a high level:

- `src/app.ts` defines the main `AppModule`
- feature domains such as `auth`, `user`, `workout`, `messages`, `oauth`, `analytics`, `aerobics`, `bootstrap`, `video-analysis`, and `web-sockets` are exposed as Nest modules
- cross-cutting infrastructure such as Redis, PostgreSQL, Socket.IO, cache, AWS, mailer, and queues is wired through dedicated Nest modules/providers
- the worker process also boots through Nest application context, so API and workers now share the same dependency-injection model

**Video analysis flow:** Client -> Node API (`getpresignedurl`) -> presigned S3 upload -> S3 event notification -> SQS (with DLQ) -> Python analysis worker -> Redis Pub/Sub -> Node subscriber -> Socket.IO -> Client

This flow keeps large uploads and pose-analysis work out of the API request thread while allowing the Python worker to scale independently from the Node request layer.
It also carries `jobId`, `requestId`, and Sentry trace headers through S3 object metadata so the async pipeline can be monitored across service boundaries.

### Video Analysis Architecture

![Video analysis architecture](https://github.com/user-attachments/assets/62af4f0e-5dd1-45bc-8334-712721f92990)

## Folder Tree

```text
.
|-- src
|   |-- app.ts
|   |-- index.ts
|   |-- instrument.ts
|   |-- config
|   |   |-- app.config.ts
|   |   |-- auth.config.ts
|   |   |-- database.config.ts
|   |   |-- email.config.ts
|   |   |-- logger.config.ts
|   |   |-- redis.config.ts
|   |   |-- sentry.config.ts
|   |   `-- storage.config.ts
|   |-- infrastructure
|   |   |-- logger.ts
|   |   |-- sentry.ts
|   |   |-- cache
|   |   |-- db
|   |   |-- queues
|   |   |-- redis
|   |   |-- socket.io
|   |   |-- supabase
|   |   |-- mailer
|   |   `-- aws
|   |-- modules
|   |   |-- aerobics
|   |   |-- analytics
|   |   |-- auth
|   |   |   |-- password
|   |   |   |-- session
|   |   |   `-- verification
|   |   |-- bootstrap
|   |   |-- exercises
|   |   |-- messages
|   |   |-- oauth
|   |   |   |-- apple
|   |   |   `-- google
|   |   |-- push
|   |   |-- user
|   |   |   |-- create
|   |   |   |-- push-tokens
|   |   |   `-- update
|   |   |-- video-analysis
|   |   |-- web-sockets
|   |   `-- workout
|   |       |-- plan
|   |       `-- tracking
|   |-- common
|   |   |-- authentication
|   |   |-- decorators
|   |   |-- filters
|   |   |-- guards
|   |   |-- middlewares
|   |   |-- pipes
|   |   `-- tests
|-- workers
|   |-- entry.ts
|   |-- emails
|   `-- push
|-- pythonService
|-- docs
|-- scripts
|-- schema.sql
|-- docker-compose.yml
`-- README.md
```

## Tech Stack

| Layer                | Main Tools                            |
| -------------------- | ------------------------------------- |
| API                  | Node.js, NestJS, TypeScript           |
| Database             | PostgreSQL                            |
| Async infrastructure | Redis, Bull, SQS, Pub/Sub             |
| Realtime             | Socket.IO                             |
| Storage              | AWS S3, Supabase Storage              |
| Auth & validation    | JWT, DPoP, Zod shared schemas, bcrypt |
| Notifications        | Expo Push, Resend                     |
| Observability        | Pino, Sentry                          |
| Testing              | Vitest, Supertest                     |
| Video analysis       | Python, boto3, SQS, OpenCV, MediaPipe |

Redis is used for Pub/Sub and selected internal queues, while SQS is used as the event-driven bridge between S3 uploads and the Python video-analysis worker.
Socket.IO is used to push analysis results and other realtime events back to the client without polling.
PostgreSQL holds both operational data and analytics-oriented structures such as views, indexes, and reminder-related tables.

## Request Pipeline

The current request pipeline is built around Nest middlewares, guards, interceptors, pipes, and filters instead of the previous Express-only middleware chain.

In practice, this means the server now separates responsibilities much more clearly:

- middlewares handle request-wide concerns before controller logic
- guards protect routes and verify caller identity/access rules
- pipes validate and normalize incoming request data
- interceptors wrap execution around handlers when a flow needs extra runtime behavior
- filters centralize exception handling so failures are logged and returned consistently

### Pipeline Layers

| Layer                  | Current role in the system                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Nest app bootstrap     | Creates the application, enables CORS, applies Helmet, and attaches global app behavior   |
| Middleware             | Handles request logging, bot blocking, app-version checks, and general rate limiting       |
| Guards                 | Enforces authentication, authorization, and DPoP proof validation                          |
| Pipes                  | Validates request contracts and DTO shape before business logic runs                       |
| Interceptors           | Wraps authenticated flows in request-scoped DB/RLS transaction behavior                    |
| Filters                | Standardizes exception handling and response formatting                                    |
| Infrastructure modules | Provide Redis, DB, Socket.IO, cache, queues, mailer, and AWS integrations through Nest DI |

### What each layer does here

**Middlewares**

- `GeneralRateLimitMiddleware` applies broad request throttling at the edge.
- `RequestLoggerMiddleware` attaches request context for structured logging and traceability.
- `BotBlockerMiddleware` blocks suspicious bot/scanner traffic before it reaches business logic.
- `CheckAppVersionMiddleware` enforces the minimum supported client version.

These run early in the lifecycle and help keep the rest of the stack focused on valid, expected traffic.

**Guards**

- `AuthenticationGuard` validates access tokens, checks token version state, and attaches the authenticated user to the request.
- `AuthorizationGuard` enforces role-based access rules where needed.
- `DpopGuard` validates DPoP proof-of-possession behavior for protected flows.
- `RateLimitGuard` adds route-level protection where a guard is a better fit than a global middleware.

The guard layer is where identity, permissions, and proof binding are enforced before protected handlers run.

**Pipes**

- `ValidateRequestPipe` validates request payloads against the shared contract layer before controllers/services execute.

This keeps request validation explicit and prevents invalid input from leaking deeper into the app.

**Interceptors**

- `RlsTxInterceptor` wraps authenticated request execution in a request-scoped database transaction, sets the current Postgres app user context, and aligns the app layer with Row Level Security behavior.

This is one of the key architectural pieces in the current NestJS setup because it connects authenticated API execution to the database authorization model.

**Filters**

- `GlobalExceptionFilter` centralizes exception handling and shapes error responses in one place.

That gives the app a more consistent failure model and makes operational debugging easier alongside structured logs and Sentry.

### Why it matters

- **Security is enforced before business logic**: authentication, DPoP verification, **rate limits**, bot filtering, and version checks all happen at the request boundary.
- **Validation is explicit**: route inputs are validated before controller execution, which keeps request contracts clearer and safer across the backend and shared package.
- **Database access is controlled**: protected flows can run through `RlsTxInterceptor`, giving the backend a clean bridge between API identity and DB-level authorization patterns.
- **Operational debugging is easier**: request IDs, structured logs, and Sentry context make production issues significantly easier to trace.
- **The architecture is more maintainable**: feature logic and infrastructure now follow the same Nest dependency-injection model across the API and worker processes.

## Run Locally

### Docker setup

The repository includes multiple Docker entry points to match both the current deployment model and future service separation.

- The root `Dockerfile` is the main container currently used on **Render**. It runs `start.sh`, which starts both the **Node API** and the **background workers** inside the same VM.
- Separate Dockerfiles also exist for `src/Dockerfile` and `workers/Dockerfile`. They support a more modular deployment model where the API and workers can be split into independent services later.
- `pythonService/Dockerfile` is dedicated to the computer-vision service and is intended to run as a **private service** on Render.

This setup keeps the current deployment simple while leaving room to separate services further as operational needs grow.

1. Create `.env.development` for local work, or `.env.production` for production-style runs:

```env
PORT=
NODE_ENV=
DPOP_ENABLED=
CACHE_ENABLED=
MIN_APP_VERSION=

# Sentry
SENTRY_DSN=
SENTRY_ENVIRONMENT=
SENTRY_RELEASE=
SENTRY_TRACES_SAMPLE_RATE=
SENTRY_PROFILES_SAMPLE_RATE=

# DB
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=
BUCKET_NAME=

# Secrets
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_VERIFY_SECRET=
JWT_FORGOT_PASSWORD_SECRET=
JWT_SOCKET_SECRET=
CHANGE_EMAIL_SECRET=

# Redis
ENABLE_SOCKET_REDIS_ADAPTER=
REDIS_URL=
REDIS_USERNAME=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# URLS
PUBLIC_BASE_URL=
PUBLIC_BASE_URL_RENDER_DEFAULT=
PRIVATE_BASE_URL_DEV=

# Apple
APPLE_ALLOWED_AUDS=

# Cache TTLS
CACHE_TTL_TRACKING_SEC=
CACHE_TTL_TIMEZONE_SEC=
CACHE_TTL_PLAN_SEC=
CACHE_TTL_AEROBICS_SEC=
CACHE_TTL_ANALYTICS_SEC=

# Resend (mailer)
RESEND_API_KEY=

# Constants
SYSTEM_USER_ID=

# Python worker
ANALYSIS_SQS_QUEUE_URL=
ANALYSIS_SQS_WAIT_TIME_SECONDS=
ANALYSIS_SQS_VISIBILITY_TIMEOUT=
ANALYSIS_WORKER_IDLE_SLEEP_MS=

```

2. Install dependencies:

```bash
npm install
```

3. Start the local development database and apply migrations/seeds:

```bash
npm run db:dev:start
```

4. Start the API:

```bash
npm run start:server
```

5. Start background workers:

```bash
npm run start:workers
```

6. Or run the stack with Docker Compose through the environment-specific scripts:

```bash
npm run orch:dev
```

Use `npm run orch:prod` when you want Compose to load `.env.production`.
Use `npm run db:dev:migrate` when you want to reapply only migrations without reseeding.

## Testing

The project includes integration tests for the main product flows:

- Authentication
- Users
- Workouts
- Bootstrap
- Messages
- Aerobics
- Analytics
- Exercises
- OAuth
- Video analysis
- WebSockets

Useful commands:

```bash
npm run db:dev:start
npm run test:db:reset
npm run test:all
```

You can also run domain-specific suites such as `npm run test:auth`, `npm run test:workouts`, or `npm run test:videoanalysis`.

### CI

GitHub Actions can run the full test suite on every push and pull request to `main` via [`.github/workflows/ci.yml`](./.github/workflows/ci.yml). For CI, store the full `.env.test` contents in a repository secret named `ENV_TEST_FILE`.

## Database Overview

PostgreSQL is the system of record. The schema is used not only for storage, but also for workout modeling, analytics-oriented views, reminder-related computation, and access-control-aware query design.

### Key database design choices

- **Normalized workout tracking**: workout timing lives in `workout_summary`, while set-level records point to it through `workout_summary_id`.
- **Analytics-friendly views**: views such as `v_exercisetracking_expanded` rebuild rich workout history without duplicating business logic in the API layer.
- **Reminder intelligence**: `user_split_information` and `user_reminder_settings` support personalized workout reminders based on actual training behavior.
- **Retention housekeeping**: `housekeeping_compact_old_workouts()` keeps workout history compact based on workout-day boundaries.
- **Indexing for real usage**: the schema includes targeted indexes for reminders, tracking lookups, and workout time queries.
- **Security-aware DB design**: the exported schema includes Row Level Security policies for user-owned data.

## Database Workflow

The database workflow was updated around a Postgres-first, repo-owned model.

- migrations now live under `src/infrastructure/db/schema/migrations`
- seed files live under `src/infrastructure/db/schema/seeds`
- Atlas is used to diff and apply migrations
- local development and test databases are separated
- test runs rebuild the test database from migration history rather than relying on leftover local state

Useful commands:

```bash
npm run db:dev:start
npm run db:dev:migrate
npm run db:migrate:diff -- <migration_name>
npm run db:prod:migrate
npm run test:db:reset
```

### Important tables and objects

| Object                                                    | Purpose                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| `users`                                                   | user identity, profile data, and session versioning          |
| `messages`                                                | inbox-style system/user messaging                            |
| `workoutplans`, `workoutsplits`, `exercisetoworkoutsplit` | workout-program structure                                    |
| `workout_summary`                                         | authoritative workout start/end window per completed workout |
| `exercisetracking`                                        | set-by-set execution records linked to `workout_summary`     |
| `aerobictracking`                                         | cardio / aerobic activity tracking                           |
| `user_reminder_settings`                                  | reminder preferences per user                                |
| `user_split_information`                                  | inferred preferred split timing and weekday                  |
| `v_exercisetracking_expanded`, `v_prs`                    | reporting and analytics views                                |

### DB files

- Full schema: [schema.sql](./schema.sql)
- Migrations: [src/infrastructure/db/schema/migrations](./src/infrastructure/db/schema/migrations)
- Seed data: [src/infrastructure/db/schema/seeds](./src/infrastructure/db/schema/seeds)
- Test helpers and test bootstrap: [src/common/tests](./src/common/tests)

### Database Schema

![Database schema overview](https://github.com/user-attachments/assets/9e518921-8f86-4882-8d05-96bbbd0c8d47)

### Workout tracking model

1. A completed workout creates a row in `workout_summary`.
2. Each tracked set is written into `exercisetracking` with a `workout_summary_id`.
3. Analytics queries read from views that join tracking data back to the workout summary.
4. Reminder and housekeeping jobs rely on that normalized structure instead of duplicated timestamps.

## Database Flows

### Workout Flow

![Database workout flow](https://github.com/user-attachments/assets/7a634d62-9c30-4546-b24e-46df64781a6a)

1. A user creates or updates a workout plan.
2. Splits are stored in `workoutsplits`.
3. Exercises are attached through `exercisetoworkoutsplit`.
4. Reminder metadata can later be derived from actual user activity.

### Tracking Flow

![Database tracking flow](https://github.com/user-attachments/assets/be800fc7-5411-40f5-9740-2395af151f08)

1. Finishing a workout creates a `workout_summary` row.
2. Each performed set is saved in `exercisetracking`.
3. Analytics views join tracking rows back to `workout_summary`.
4. Retention logic works on workout-day boundaries rather than per-set timestamps.

### Messages Flow

![Database messages flow](https://github.com/user-attachments/assets/9a87b874-be46-403e-bfbc-c3709175767f)

1. The system creates a message.
2. The user fetches and reads it.
3. The message can be deleted from the user-facing inbox flow.

### Auth Flow

![Database auth flow](https://github.com/user-attachments/assets/eb0c0c2a-84bc-4409-9b7a-b7019c1ebd27)

1. The user authenticates with credentials or OAuth.
2. The backend issues access and refresh tokens.
3. Protected requests can be bound to DPoP proofs.
4. Session invalidation is handled through token versioning.

### Reminder Flow

![Reminder flow](https://github.com/user-attachments/assets/39a0c9fb-aba8-4e27-8c6d-2568167e546c)

1. `refresh_user_split_information()` computes reminder timing from training history.
2. The backend reads reminder settings and upcoming split timing.
3. Push notifications are queued and delivered to the user device.
