# System Architecture

![Strong Together Backend - Feature Modules and Infrastructure Access](./media/serverarch.png)

Strong Together is a NestJS modular monolith backed by PostgreSQL, Redis, LocalStack/AWS, Socket.IO, Node workers, and a Python computer-vision worker.

The diagram above is a combined **feature modules and infrastructure access** view. It intentionally mixes NestJS feature modules, shared request infrastructure, external resources, and worker runtimes so the main backend dependencies are visible in one place.

## Architectural Thesis

The primary API stays as a monolith because the domain is cohesive: identity, workouts, analytics, reminders, messaging, and media processing all share user context and database access rules. Instead of splitting prematurely into networked services, the code separates concerns inside Nest modules and moves expensive or side-effect-heavy work to asynchronous workers.

This gives the system a pragmatic balance:

- Fast local reasoning through one NestJS application.
- Strong dependency management through Nest modules and providers.
- Real operational boundaries for CPU-heavy and event-driven work.
- Shared security and RLS context across business flows.

## Runtime Components

| Component                          | Responsibility                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| NestJS API                         | HTTP routes, auth, users, workout planning/tracking, analytics, messages, push triggers, presigned video upload URLs, Socket.IO hosting |
| PostgreSQL                         | Operational data, domain schemas, analytics views, token version state, RLS policies                                                    |
| Redis                              | Cache, JTI replay protection, Redis Pub/Sub, Socket.IO adapter support, Bull queue backing store                                        |
| Socket.IO                          | Authenticated user-room realtime delivery for messages and video-analysis results                                                       |
| Node workers                       | Email and push notification background processing                                                                                       |
| Python worker                      | SQS-driven video analysis using OpenCV/MediaPipe-style utilities                                                                        |
| S3 / LocalStack / Supabase Storage | Video uploads, S3 event source for video jobs, profile image storage                                                                    |
| SQS / LocalStack                   | Durable video-analysis handoff from S3 uploads to the Python worker                                                                     |
| Maildev / Resend                   | Local email capture and production email sending abstraction                                                                            |
| Expo Push                          | Push notification delivery                                                                                                              |
| Sentry / Pino                      | Tracing, structured logging, error capture, request correlation                                                                         |

## Global Request Layer

All HTTP routes enter through the shared API boundary before controller logic.

| Layer                        | Purpose                                                   | Resource access                   |
| ---------------------------- | --------------------------------------------------------- | --------------------------------- |
| `helmet()` / CORS            | Security headers and origin policy                        | HTTP response/request config      |
| `GeneralRateLimitMiddleware` | Coarse route/client throttling                            | In-memory `Map`                   |
| `RequestLoggerMiddleware`    | `x-request-id`, structured request logs, Sentry context   | Pino, Sentry                      |
| `BotBlockerMiddleware`       | Scanner and suspicious-client filtering                   | Pino, Sentry bot marker           |
| `CheckAppVersionMiddleware`  | Rejects unsupported mobile app versions                   | `appConfig.minAppVersion`         |
| `DpopGuard`                  | Proof-of-possession request validation                    | Redis JTI key: `dpop:jti:*`       |
| `AuthenticationGuard`        | Access token validation, token version check, user lookup | PostgreSQL, JWT                   |
| `AuthorizationGuard`         | Role enforcement from `@Roles(...)` metadata              | Request user role                 |
| `RateLimitGuard`             | Route-specific login/email/update throttling              | In-memory `Map`                   |
| `ValidateRequestPipe`        | Shared Zod request contract validation                    | `@strong-together/shared` schemas |
| `RlsTxInterceptor`           | Request-scoped DB transaction with RLS identity           | PostgreSQL                        |
| `FileInterceptor`            | Profile image upload parsing                              | Multer memory config              |
| `GlobalExceptionFilter`      | Normalized error responses and server error capture       | Pino, Sentry                      |

`RlsTxInterceptor` calls `DBService.runWithRlsTx`. For authenticated requests, PostgreSQL receives:

```sql
select set_config('app.current_user_id', <user-id>, true);
SET LOCAL ROLE authenticated;
```

This keeps application authorization and database authorization active together.

## Feature Modules

Feature modules live under `src/modules`.

| Module           | Main responsibility                                                      | Infrastructure access                                                       |
| ---------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `auth`           | Session login/refresh/logout, password reset, account verification       | PostgreSQL, Redis JTI cache, Redis email queue, messages                    |
| `user`           | Create user, update profile, push tokens, profile pictures, email change | PostgreSQL, Redis JTI cache, Redis email queue, Supabase/LocalStack storage |
| `workout`        | Workout plan creation and workout tracking                               | PostgreSQL, Redis cache, messages                                           |
| `messages`       | User inbox and system messages                                           | PostgreSQL, Socket.IO                                                       |
| `video-analysis` | Presigned video upload URL and realtime result bridge                    | S3, Redis Pub/Sub, Socket.IO                                                |
| `web-sockets`    | Authenticated Socket.IO ticket generation                                | JWT socket ticket signing                                                   |
| `push`           | Scheduler-style push notification enqueue endpoints                      | PostgreSQL, Redis push queue                                                |
| `analytics`      | Goal adherence and strength analytics                                    | PostgreSQL analytics views, Redis cache                                     |
| `aerobics`       | Cardio/aerobic tracking                                                  | PostgreSQL, Redis cache                                                     |
| `oauth`          | Google and Apple sign-in                                                 | Provider token verification, PostgreSQL, messages                           |
| `bootstrap`      | Initial mobile startup payload aggregation                               | Redis timezone cache plus user/workout/messages/aerobics services           |
| `exercises`      | Exercise catalog                                                         | PostgreSQL                                                                  |

Infrastructure modules live under `src/infrastructure` and provide reusable clients/adapters such as `DBModule`, `RedisModule`, `CacheModule`, `SocketIOModule`, `AWSModule`, `SupabaseModule`, queue modules, and `MailerModule`.

## Module Details

### Auth

`AuthModule` is split into session, password, and verification flows.

- `SessionService` uses `SessionQueries` for login, refresh rotation, logout, token-version bumping, and first-login state. First login can call `SystemMessagesService`.
- `PasswordService` uses PostgreSQL for user/password updates and Redis for one-time forgot-password JTI keys: `forgotpassword:jti:*`.
- `PasswordEmailsService` generates the reset token and enqueues email jobs. It does not write cache keys.
- `VerificationService` uses PostgreSQL for verification state and Redis for one-time verification JTI keys: `accountverify:jti:*`.
- `VerificationEmailsService` generates verification tokens and enqueues email jobs.

### User

`UserModule` is split into create, push tokens, and update/profile flows.

- `CreateUserService` creates the user and default reminder settings in PostgreSQL, then calls `VerificationEmailsService`.
- `PushTokensService` stores Expo push tokens in PostgreSQL.
- `UpdateUserService` reads and updates profile data, stores one-time email-change JTI keys as `emailchange:jti:*`, and uses `SupabaseStorageService` for profile images.
- `UpdateEmailsService` enqueues email-change confirmation emails.

### Workout

`WorkoutModule` is split into plan and tracking flows.

- `WorkoutPlanService` reads/writes plans through `WorkoutPlanQueries` and caches plan payloads with `xt:workoutplan:v1:{userId}:{tz}`.
- Updating a plan invalidates the plan cache and the analytics cache `xt:analytics:v1:{userId}`.
- `WorkoutTrackingService` reads/writes tracking data through `WorkoutTrackingQueries`, caches tracking payloads with `xt:tracking:v1:{userId}:{days}:{tz}`, and creates system messages when a workout is completed.

### Messages

`MessagesModule` handles user inbox reads/updates and system-generated messages.

- `MessagesService` reads and mutates message rows through `MessagesQueries`.
- `MessagesService.emitNewMessage` emits `new_message` through `SocketIOService`.
- `SystemMessagesService` inserts system messages directly into PostgreSQL and then emits them through `MessagesService`.

### Video Analysis

`VideoAnalysisModule` creates presigned upload URLs and bridges worker results back to users.

Flow:

```text
Mobile client
-> NestJS API presigned URL
-> direct S3 upload
-> S3 ObjectCreated event
-> SQS
-> Python worker
-> Redis Pub/Sub channel video-analysis:results
-> VideoAnalysisSubscriber
-> Socket.IO event video_analysis_results
-> Mobile client
```

The current implementation delivers analysis results in realtime and does not persist video-analysis results to PostgreSQL.

### WebSockets

`WebSocketsModule` generates short-lived signed socket tickets through `WebSocketsService`.

`SocketIOService` is infrastructure. It attaches Socket.IO to `/socket.io`, validates the ticket, joins the socket to the authenticated user room, and emits user-targeted events. When enabled, the Socket.IO Redis adapter uses Redis pub/sub clients for multi-instance fanout.

### Push

`PushModule` exposes scheduler-style enqueue routes:

- `GET /api/push/daily`
- `GET /api/push/hourlyreminder`

`PushService` queries eligible users from PostgreSQL and enqueues jobs into the Redis-backed Bull queue `{env}:pushNotificationsQueue`. The push worker consumes those jobs and sends notifications to Expo Push.

### Analytics

`AnalyticsService` reads from PostgreSQL analytics views and caches payloads with:

```text
xt:analytics:v1:{userId}
```

The module is read-heavy and does not mutate domain data directly.

### Aerobics

`AerobicsService` reads and writes `tracking.aerobictracking` through `AerobicsQueries` and caches cardio history with:

```text
xt:aerobics:v1:{userId}:{days}:{tz}
```

### OAuth

`OAuthModule` is split into Google and Apple flows.

- Provider utilities verify the external ID token/JWKS.
- Provider queries find, link, or create users and `identity.oauth_accounts` rows.
- `SessionQueries` bumps token versions and returns auth payload data.
- First-login flows can call `SystemMessagesService`.

### Bootstrap

`BootstrapModule` is an aggregation module for mobile startup data. It calls:

- `UpdateUserService`
- `WorkoutPlanService`
- `WorkoutTrackingService`
- `MessagesService`
- `AerobicsService`

It also caches the requested timezone with:

```text
xt:timezone:v1:{userId}
```

### Exercises

`ExercisesModule` reads the exercise catalog from `workout.exercises`. It has no Redis cache, queue, Socket.IO, or storage dependency today.

## Redis Roles

Redis is one shared infrastructure resource with several logical uses:

| Use                                | Code path                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------- |
| JSON response cache                | `CacheService` via `REDIS_CLIENT`                                         |
| DPoP replay protection             | `DpopGuard` -> `CacheService.cacheStoreJti('dpop', ...)`                  |
| Password reset one-time URLs       | `PasswordService` -> `forgotpassword:jti:*`                               |
| Account verification one-time URLs | `VerificationService` -> `accountverify:jti:*`                            |
| Email-change one-time URLs         | `UpdateUserService` -> `emailchange:jti:*`                                |
| Video-analysis result delivery     | Python publisher -> `video-analysis:results` -> `VideoAnalysisSubscriber` |
| Socket.IO scaling                  | `SocketIOService` Redis adapter clients                                   |
| Email queue                        | Bull queue `{env}:emailsQueue`                                            |
| Push queue                         | Bull queue `{env}:pushNotificationsQueue`                                 |

The Bull queues use `redisConfig.url` directly. They are Redis-backed, but they are not created through `RedisModule`.

## Background Workers

Node workers are started from `workers/entry.ts` as a Nest application context.

| Worker                   | Consumes                       | Produces / side effect                                                         |
| ------------------------ | ------------------------------ | ------------------------------------------------------------------------------ |
| Email worker             | `{env}:emailsQueue`            | Sends through Maildev in local/test or Resend in production-style environments |
| Push notification worker | `{env}:pushNotificationsQueue` | Sends to Expo Push                                                             |

Both workers use structured logs and capture worker exceptions through Sentry.

## Python Video Worker

The Python worker long-polls SQS for S3 upload events. For each valid S3 record, it:

1. Reads object metadata for job/request/user/trace correlation.
2. Downloads the source video from S3.
3. Runs video analysis.
4. Publishes the result to Redis channel `video-analysis:results`.
5. Deletes the source video from S3.
6. Deletes the SQS message after successful processing.

SQS remains the retry authority because the message is deleted only after processing and cleanup succeed.

## Data Access Pattern

The project uses query classes and `postgres` tagged templates rather than hiding SQL behind a heavy ORM. That fits the schema because the database contains domain-specific views, RLS policies, indexes, and analytics queries that benefit from explicit SQL.

`DBService` wraps the SQL client with `AsyncLocalStorage`, allowing injected SQL calls to automatically use the request-bound RLS transaction when present.

## Async Boundaries

The system uses asynchronous processing where latency or external side effects would make synchronous HTTP brittle:

- Video analysis uses S3, SQS, Python processing, Redis Pub/Sub, and Socket.IO.
- Emails and push notifications are handled by background workers.
- Redis Pub/Sub decouples the Python worker from the connected WebSocket process.
- Bull queues decouple HTTP enqueue flows from provider-side email and push delivery.

The architecture prefers explicit boundaries around expensive work, retryable handoffs, and observability propagation across services.
