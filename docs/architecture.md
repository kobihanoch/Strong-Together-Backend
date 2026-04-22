# System Architecture

Strong Together is a NestJS modular monolith backed by PostgreSQL, Redis, LocalStack/AWS, Socket.IO, Node workers, and a Python computer-vision worker.

## Architectural Thesis

The project keeps the primary API as a monolith because the domain is cohesive: identity, workouts, analytics, reminders, messaging, and media processing all share user context and database access rules. Instead of splitting prematurely into networked services, the code separates concerns inside the monolith and moves heavy work to asynchronous workers.

This gives the system a pragmatic balance:

- Fast local reasoning through one NestJS application.
- Strong dependency management through Nest modules and providers.
- Real operational boundaries for CPU-heavy and event-driven work.
- Shared security and RLS context across business flows.

## Runtime Components

| Component | Responsibility |
| --- | --- |
| Nest HTTP API | Auth, users, workout planning, tracking, analytics, messages, push entrypoints, presigned URL generation |
| PostgreSQL | Operational data, analytics views, domain schemas, RLS policies |
| Redis | Cache, Pub/Sub, queue infrastructure support, DPoP JTI replay cache |
| Socket.IO | Realtime user-targeted delivery, including video-analysis results |
| Node workers | Email and push notification background processing |
| Python worker | SQS-driven video analysis using OpenCV/MediaPipe-style CV utilities |
| LocalStack/AWS | S3 direct uploads and SQS event bridge for video processing |
| Maildev/Resend | Local email capture and production-style email sending abstraction |
| Sentry/Pino | Tracing, structured logging, error capture, request correlation |

## NestJS Module Layout

Feature modules live under `src/modules`:

- `auth`: login, refresh, logout, password reset, verification
- `user`: create, update, profile picture, push tokens
- `workout`: plan creation and workout tracking
- `analytics`: goal adherence, PRs, RM-oriented insights
- `aerobics`: cardio tracking
- `messages`: user and system messages
- `oauth`: Google and Apple sign-in
- `push`: scheduled push notification entrypoints
- `video-analysis`: presigned upload URL and realtime result bridge
- `web-sockets`: authenticated Socket.IO ticket generation
- `bootstrap`: client startup payload
- `exercises`: exercise catalog

Infrastructure modules live under `src/infrastructure` and are imported by the app as reusable providers. That split makes feature modules read like product code while keeping connection lifecycle, adapters, and third-party clients centralized.

## Request Lifecycle

1. `GeneralRateLimitMiddleware` applies coarse route/client throttling.
2. `RequestLoggerMiddleware` assigns or propagates `x-request-id`, enriches request logs, and updates Sentry context.
3. `BotBlockerMiddleware` filters scanner traffic, suspicious paths, and non-app clients.
4. `CheckAppVersionMiddleware` rejects unsupported mobile clients unless the route is explicitly exempt.
5. Guards enforce DPoP, JWT authentication, and role authorization.
6. `ValidateRequestPipe` validates shared Zod contracts at the controller boundary.
7. `RlsTxInterceptor` runs authenticated handlers inside a PostgreSQL transaction with request-scoped RLS identity.
8. `GlobalExceptionFilter` normalizes failures and logs them with request/user context.

The key decision is that application authorization and database authorization are both active. Guards prevent invalid work from reaching service code; RLS prevents cross-user data leakage even if a query is accidentally too broad.

## Data Access Pattern

The project uses query classes and `postgres` tagged templates rather than hiding SQL behind a heavy ORM. That is a strong fit for this codebase because the schema contains domain-specific views, RLS policies, indexes, and analytics queries that benefit from explicit SQL.

`DBService` wraps the SQL client with `AsyncLocalStorage`. During authenticated requests, any injected SQL call automatically uses the request-bound transaction created by `runWithRlsTx`. Inside that transaction, the server sets:

```sql
select set_config('app.current_user_id', <user-id>, true);
SET LOCAL ROLE authenticated;
```

That makes PostgreSQL policies part of the normal request path, not an afterthought.

## Async Boundaries

The system uses asynchronous processing where latency or external side effects would make synchronous HTTP brittle:

- Video analysis uses S3, SQS, Python processing, Redis Pub/Sub, and Socket.IO.
- Emails and push notifications are handled by background workers.
- Redis Pub/Sub decouples the Python worker from the connected WebSocket process.

The architecture prefers explicit boundaries around expensive work, idempotent-ish retry points, and observability propagation across services.
