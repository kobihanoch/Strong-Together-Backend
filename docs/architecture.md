# System Architecture

> **Strong Together is a Clean Architecture and Hexagonal Architecture modular monolith.** Clean Architecture keeps dependencies pointing toward application behavior; Hexagonal Architecture places ports around that behavior and implements external concerns as adapters.

The backend combines a NestJS API, PostgreSQL, Redis, Socket.IO, Node workers, and a Python computer-vision worker. It remains a monolith because identity, workouts, social features, messaging, schedules, and authorization share transactions and user context. Slow or failure-prone work crosses explicit asynchronous boundaries.

## Dependency Model

```mermaid
flowchart LR
  http[HTTP / Socket inbound adapters]
  presentation[Presentation<br/>controllers, validation, presenters]
  application[Application core<br/>use cases, models, errors, ports]
  domain[Domain<br/>entities and business rules]
  outbound[Outbound adapters<br/>Postgres repositories, Redis caches,<br/>queues, storage, providers, events]
  systems[(PostgreSQL / Redis / S3 / SQS<br/>Socket.IO / email / OAuth)]

  http --> presentation --> application --> domain
  application -->|port| outbound --> systems

  classDef core fill:#ecfdf5,stroke:#059669,color:#111827
  classDef adapter fill:#e8f1ff,stroke:#2563eb,color:#111827
  class application,domain core
  class http,presentation,outbound,systems adapter
```

The application layer owns its ports. Infrastructure depends on those ports, never the reverse. Nest modules bind port tokens to concrete adapters and act as composition roots. See [Clean Architecture + Hexagonal Architecture Module Structure](./clean-architecture-module-structure.md) for the required feature layout.

## Request Lifecycle

```mermaid
flowchart LR
  request[HTTP request] --> middleware[Helmet, CORS, rate limit,<br/>request logger, bot/version checks]
  middleware --> guards[DPoP, authentication,<br/>authorization]
  guards --> validation[Zod validation]
  validation --> transaction[RLS transaction]
  transaction --> controller[Presentation controller]
  controller --> usecase[Application use case]
  usecase --> port[Application port]
  port --> adapter[Infrastructure adapter]
  adapter --> resource[(Postgres / Redis / provider)]
  usecase --> response[Response]
```

`RlsTxInterceptor` wraps request work in `DBService.runWithRlsTx`. Unauthenticated flows start as the PostgreSQL `guest` role. Authenticated requests set `app.current_user_id` and use the `authenticated` role. Public authentication can promote the current transaction only after credentials or a signed token are verified.

Expected feature failures are transport-neutral application errors. `GlobalExceptionFilter` maps shared error categories to HTTP statuses; application errors do not know about NestJS or HTTP.

## Feature Slice

Non-trivial modules use this shape:

```text
feature/
  domain/                  # optional entities and rules
  application/
    errors/                # feature errors, categorized without HTTP knowledge
    models/                # use-case and port data
    ports/                 # repository/cache/queue/storage/provider contracts
    use-cases/             # one focused operation per class
  infrastructure/
    *.repository.ts        # Postgres adapters
    *.sql.ts               # explicit SQL
    *.db-types.ts          # persistence-only types
    ...                    # Redis, storage, queue, provider, event adapters
  presentation/
    *.controller.ts        # inbound HTTP adapter
  *.module.ts              # dependency-injection composition root
```

This pattern is used across auth, users, workout planning and tracking, schedules, reminders, messages, aerobics, exercises, OAuth, push, social features, video analysis, and WebSocket ticketing. Larger capabilities are split into independently composed submodules.

## Runtime Components

| Component | Responsibility |
| --- | --- |
| NestJS API | HTTP presentation, guards, validation, use-case composition, Socket.IO hosting |
| `@strong-together/shared` | Plain-Zod public request, response, and cross-process contracts; no database schemas or backend types |
| PostgreSQL | Domain schemas, explicit repository SQL, views, RLS policies, token state, transactions |
| Redis | Response caches, one-time token/JTI storage, Pub/Sub, Socket.IO scaling, Bull queue storage |
| Node workers | Queue-driven email and push delivery |
| Python worker | SQS-driven video analysis using OpenCV/MediaPipe utilities |
| S3 / LocalStack / Supabase Storage | Video uploads/events and image storage adapters |
| SQS / LocalStack | Durable video-analysis handoff |
| Maildev / Resend / Expo | Email and push delivery providers |
| Sentry / Pino | Tracing, error capture, structured operation logging, request correlation |

## Feature Modules

| Module | Main responsibility | Principal outbound adapters |
| --- | --- | --- |
| `auth` | Login/refresh/logout, password reset, verification | Postgres, JWT, bcrypt, Redis tokens, queued email, events |
| `user` | Registration, profile, push tokens, profile pictures, email change | Postgres, storage, Redis/JWT, queued email, events |
| `workout` | Plans, completed workouts, history, statistics and PRs | Postgres repositories, Redis caches |
| `workout-schedule` | Weekly split schedules and atomic replacement | Postgres repository, Redis cache |
| `reminders` / `push` | Preferences and scheduled notification enqueueing | Postgres, Bull/Redis, Expo worker |
| `messages` | Inbox mutations and realtime publication | Postgres, Socket.IO publisher |
| `social` | Crews, requests, users, posts, comments, reactions, summary | Postgres, image storage, Socket.IO/message adapters |
| `video-analysis` | Upload URL creation and analysis-result publication | S3, telemetry, Redis subscriber, Socket.IO |
| `web-sockets` | Short-lived authenticated socket tickets | JWT ticket issuer |
| `aerobics` / `exercises` | Cardio history and exercise catalog | Postgres, Redis where applicable |
| `oauth` | Google and Apple sign-in | Provider verifiers, Postgres, registration/session events |

## Persistence And Transactions

Application use cases depend on repository abstractions such as `WorkoutPlanRepository`; concrete `Postgres*Repository` adapters own SQL, Drizzle-derived row types, and mapping. `DBService` supplies a `postgres` tagged-template client bound through `AsyncLocalStorage` to the active RLS transaction.

External work that must not run before commit is registered through the application-owned `TransactionHooks` port. Its PostgreSQL adapter delegates to `DBService.afterCommit(...)`. This is appropriate for cache invalidation and other best-effort side effects; critical guaranteed delivery should use a transactional outbox.

## Events And Cross-Module Reactions

Lifecycle reactions use application events instead of importing another feature's concrete service. Producers depend on a publisher port; infrastructure publishes the event; the consuming module owns its listener. User registration and first login use this pattern for email/message reactions while preserving module direction.

## Asynchronous Boundaries

```mermaid
flowchart LR
  api[NestJS API] -->|email/push job| bull[(Bull on Redis)] --> node[Node workers] --> providers[Resend / Maildev / Expo]
  api -->|presigned URL| client[Mobile client] --> s3[(S3)] --> sqs[(SQS)] --> python[Python CV worker]
  python -->|result| pubsub[(Redis Pub/Sub)] --> subscriber[Nest subscriber] --> socket[Socket.IO user room]
```

SQS remains the retry authority for video processing because its message is deleted only after successful processing and cleanup. Bull queues keep email and push provider latency outside HTTP requests. Redis Pub/Sub bridges Python results into authenticated Socket.IO delivery.

## Dependency Rules

- Presentation may depend on application use cases and public transport contracts.
- Application may depend on domain code, application models, and application-owned ports.
- Domain code has no NestJS, HTTP, database, cache, queue, or provider dependencies.
- Infrastructure implements ports and owns SQL rows, Redis values, SDK payloads, and mappings.
- Shared public contracts use plain Zod and do not import Drizzle tables, database schemas, repositories, or internal application models.
- Cross-module lifecycle reactions use events; synchronous capabilities cross boundaries through application ports.
