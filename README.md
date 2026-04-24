# Strong Together Backend (v4.2.0)

[![CI](https://github.com/kobihanoch/Strong-Together-Backend/actions/workflows/ci.yml/badge.svg)](https://github.com/kobihanoch/Strong-Together-Backend/actions)

Backend for **Strong Together**, a **fitness and health platform** that provides **authentication**, **workout planning**, **progress tracking**, **realtime messaging**, **push notifications**, and **asynchronous exercise video analysis**.

- Backend repository: [Strong-Together-Backend](https://github.com/kobihanoch/Strong-Together-Backend)
- Frontend repository: [Strong-Together-App](https://github.com/kobihanoch/Strong-Together-App)

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

## Table Of Contents

- [Why This Project Stands Out](#why-this-project-stands-out)
- [Architecture At A Glance](#architecture-at-a-glance)
- [Expensive Engineering Features](#expensive-engineering-features)
  - [Security Model](#security-model)
  - [Video Analysis Pipeline](#video-analysis-pipeline)
  - [Local Distributed-System Environment](#local-distributed-system-environment)
  - [Database And Migrations](#database-and-migrations)
  - [Testing Strategy](#testing-strategy)
- [Quick Start](#quick-start)
- [Repository Map](#repository-map)
- [Documentation](#documentation)
- [Current Tradeoffs](#current-tradeoffs)
- [What This Demonstrates](#what-this-demonstrates)

## Why This Project Stands Out

This backend goes beyond a standard **CRUD API**. It includes several **production-grade systems** that are typically associated with mature backend platforms:

| Capability                        | Implementation                                                                                                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Secure auth lifecycle**         | **DPoP proof-of-possession**, **JWT token versioning**, **refresh rotation**, **role guards**, **app-version enforcement**, **bot filtering**, **rate limits**, and **PostgreSQL RLS** |
| **Async video-analysis pipeline** | **Direct S3 uploads**, **S3 `ObjectCreated` events**, **SQS dispatch**, **Python computer-vision worker**, **Redis Pub/Sub**, and **Socket.IO result delivery**                        |
| **Real local infrastructure**     | **One-command Docker stack** with **Postgres**, **Redis**, **LocalStack S3/SQS**, **Maildev**, **Atlas migrations**, the **API**, **workers**, and the **Python service**              |
| **Database ownership model**      | **Domain schemas**, **repo-owned Atlas migrations**, **deterministic seeds**, **RLS policies**, **analytics-oriented SQL**, and **clean dev/test separation**                          |
| **Realtime and background work**  | **Redis-backed Bull queues** for email/push jobs, **Redis Pub/Sub fanout**, **authenticated WebSocket ticketing**, and **user-targeted Socket.IO emissions**                           |
| **Operational confidence**        | **Structured Pino logs**, **request IDs**, **Sentry tracing**, **async trace propagation through S3 metadata**, and **integration tests against disposable infrastructure**            |
| **Shared contracts**              | Published **`@strong-together/shared`** package used for **runtime request validation** and **response contract testing**                                                              |

## Architecture At A Glance

```text
Mobile Client
  -> NestJS API
      -> Middleware / Guards / Pipes / Interceptors
      -> Feature Modules
      -> PostgreSQL with RLS
      -> Redis cache / queues / Pub/Sub
      -> Socket.IO
      -> S3 / SQS
      -> Node workers
      -> Python CV worker
```

The system is a **NestJS modular monolith** with clear **async boundaries**. Product domains remain in one cohesive API because they share **user context** and **database authorization rules**, while expensive or isolated workloads are handled through **queues**, **workers**, **object-storage events**, and **realtime fanout**.

**Deep dives:** [System Architecture](./docs/architecture.md) | [Security Deep Dive](./docs/security-deep-dive.md) | [Video Pipeline](./docs/video-analysis-pipeline.md) | [WebSocket Realtime](./docs/websocket-realtime.md) | [Testing Policy](./docs/testing-policy.md)

## Expensive Engineering Features

### Security Model

Security is enforced across the **HTTP edge**, **token lifecycle**, **Nest guards**, **runtime validation**, and **database policies**.

```text
Request
  -> Rate limit / bot blocker / app-version gate
  -> DPoP proof validation
  -> JWT + token_version validation
  -> role authorization
  -> Zod request validation
  -> RLS-bound PostgreSQL transaction
```

Highlights include **DPoP replay protection**, **JWT token versioning** for centralized revocation, **refresh rotation**, **role-based route authorization**, **Helmet/CORS hardening**, and **PostgreSQL row-level security** bound to the authenticated user.

**Read more:** [Security Deep Dive](./docs/security-deep-dive.md) | [API And Engineering Standards](./docs/api-and-standards.md)

### Video Analysis Pipeline

Video analysis is implemented as an **event-driven media pipeline**, keeping **large uploads** and **CPU-heavy computer-vision work** outside the HTTP request path.

```text
Client
  -> Presigned S3 upload URL
  -> S3 ObjectCreated event
  -> SQS queue
  -> Python CV worker
  -> Redis Pub/Sub
  -> Nest subscriber
  -> Socket.IO result
  -> Client
```

The API attaches **request**, **job**, **user**, **exercise**, and **Sentry trace metadata** to the S3 upload. The **Python worker** long-polls **SQS**, downloads the object, analyzes the exercise, publishes the result to **Redis**, deletes the source video, and deletes the **SQS message** only after successful processing.

**Read more:** [Video Analysis Pipeline](./docs/video-analysis-pipeline.md)

### Local Distributed-System Environment

`npm run orch:dev` starts the development stack with **Docker Compose**:

- **NestJS API**
- **Node background workers**
- **Python video-analysis service**
- **PostgreSQL**
- **Redis** and **RedisInsight**
- **Persisted LocalStack S3/SQS in dev**
- **Maildev**
- **Atlas migration runner**

This makes **S3 events**, **SQS delivery**, **Redis Pub/Sub**, **Redis queues**, **database migrations**, and **email capture** reproducible in local development.

**Read more:** [Docker Compose Environments](./docs/docker-compose-environments.md) | [Scripts Usage](./docs/scripts-usage.md)

### Database And Migrations

The database workflow is **migration-first** and **repository-owned**.

```text
Local DB change
  -> Atlas diff
  -> committed migration
  -> dev apply
  -> test rebuild from zero
```

The schema is organized into domains such as **`identity`**, **`workout`**, **`tracking`**, **`reminders`**, **`analytics`**, and **`messages`**. **RLS policies** protect user-owned data, while **explicit SQL** keeps analytics-heavy queries visible and tunable.

**Read more:** [Database Schemas And Flows](./docs/database-schemas-and-flows.md) | [Migrations And DB Pipeline](./docs/migrations-and-db-pipeline.md)

### Testing Strategy

The test suite prioritizes **integration confidence** because the highest-risk behavior crosses real boundaries: **auth**, **token rotation**, **RLS**, **Postgres**, **Redis**, **queues**, **S3/SQS emulation**, **Maildev**, and **WebSocket-adjacent flows**.

```bash
npm test
```

Focused suites:

```bash
npm run test:auth
npm run test:workouts
npm run test:videoanalysis
npm run test:websockets
```

**Read more:** [Testing Policy](./docs/testing-policy.md)

## Quick Start

```bash
npm install
npm run orch:dev
npm run db:dev:start
```

Useful local tools:

- RedisInsight: `http://localhost:5540`
- Maildev: `http://localhost:1081`
- S3 explorer: `http://localhost:8082`
- LocalStack: `http://localhost:4566`

**Read more:** [Scripts Usage](./docs/scripts-usage.md) | [Docker Compose Environments](./docs/docker-compose-environments.md)

## Repository Map

```text
src/
  app.ts                         Nest application composition
  index.ts                       HTTP bootstrap and shutdown lifecycle
  common/                        Guards, middleware, pipes, filters, decorators, test helpers
  config/                        Runtime configuration modules
  infrastructure/                DB, Redis, queues, AWS, cache, Socket.IO, mailer, Sentry
  modules/                       Domain modules and controllers
workers/                         Node background workers for email and push jobs
pythonService/                   SQS-driven video-analysis service
scripts/                         LocalStack and DB automation
docs/                            Architecture, security, testing, DB, and operations docs
```

## Documentation

| Document                                                             | What it covers                                                             |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [System Architecture](./docs/architecture.md)                        | NestJS modules, runtime components, request lifecycle, async boundaries    |
| [Security Deep Dive](./docs/security-deep-dive.md)                   | Middleware, DPoP, token versioning, authorization, validation, RLS         |
| [Video Analysis Pipeline](./docs/video-analysis-pipeline.md)         | S3, SQS, Python worker, Redis Pub/Sub, Socket.IO delivery                  |
| [WebSocket Realtime](./docs/websocket-realtime.md)                   | Socket.IO ticketing, Redis adapter, per-user rooms, targeted events        |
| [Environment Example](./docs/environment-example.md)                 | Placeholder-only environment templates and secret-handling notes           |
| [API Documentation](./docs/api-documentation.md)                     | Route index, request conventions, response shapes, operational route notes |
| [Testing Policy](./docs/testing-policy.md)                           | Test types, isolation, database reset strategy, when to add tests          |
| [API And Engineering Standards](./docs/api-and-standards.md)         | Contract standards, auth standards, error model, observability, caching    |
| [Database Schemas And Flows](./docs/database-schemas-and-flows.md)   | Domain schemas, RLS flow, migration lifecycle                              |
| [Migrations And DB Pipeline](./docs/migrations-and-db-pipeline.md)   | Atlas workflow, dev/test/prod database lifecycle                           |
| [Docker Compose Environments](./docs/docker-compose-environments.md) | Development and test Compose stacks                                        |
| [Scripts Usage](./docs/scripts-usage.md)                             | Practical command guide for development, tests, and migrations             |

## Current Tradeoffs

- Video-analysis results are currently delivered realtime-first; durable Postgres persistence for historical analysis results is a natural future extension.
- The Python video worker processes one SQS message at a time in the local environment; horizontal worker scaling is the intended path for higher throughput.
- Local development uses persisted LocalStack to exercise AWS-shaped S3/SQS behavior without requiring cloud resources, while tests keep LocalStack ephemeral.

## What This Demonstrates

This project demonstrates **secure backend design**, **typed API contracts**, **event-driven processing**, **local infrastructure automation**, **database ownership modeling**, **realtime delivery**, **observability**, and **integration testing across real service boundaries**.
