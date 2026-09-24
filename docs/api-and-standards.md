# API And Engineering Standards

This document summarizes the API style, validation approach, observability standards, and error model used by the NestJS backend.

## API Surface

The API is organized under `/api` with domain-oriented route groups:

| Domain         | Route group                           | Responsibility                                                               |
| -------------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| Auth           | `/api/auth`                           | Login, logout, refresh, verification, password reset                         |
| Users          | `/api/users`                          | Account creation, profile, profile picture, push token                       |
| Workouts       | `/api/workout-plan`, `/api/workout-*` | Plan reads/writes, schedules, and completed workout tracking                 |
| Aerobics       | `/api/aerobics`                       | Cardio history                                                               |
| Exercises      | `/api/exercises`                      | Exercise catalog                                                             |
| Messages       | `/api/messages`                       | Inbox, read state, deletion                                                  |
| OAuth          | `/api/oauth`                          | Google and Apple sign-in                                                     |
| Push           | `/api/push-jobs`                      | Scheduled push notification entrypoints                                      |
| Video analysis | `/api/video-analysis`                 | Presigned upload URL generation                                              |
| WebSockets     | `/api/websocket-tickets`              | Authenticated socket ticket generation                                       |
| Social         | `/api/social`                         | Crews, participation requests, profiles, posts, comments, reactions, summary |

The full route-level reference remains in [api-documentation.md](./api-documentation.md).

## Contract Standard

Request validation uses schemas from `@strong-together/shared`:

```ts
@RequestData(new ValidateRequestPipe(loginRequest))
```

Response types are also imported from the shared package. Tests commonly assert response bodies against shared response schemas, which turns the package into an executable contract between client and server.

The package is transport-first and Zod-first: request, response, and cross-process schemas use plain Zod and TypeScript contracts are inferred with `z.infer`. It does not import Drizzle tables or expose database types. Public request/response/event fields are camelCase; infrastructure repositories map physical snake_case columns to application models.

Standard:

- Controllers validate input at the boundary.
- Controllers call focused application use cases with validated values.
- Use cases depend on application-owned ports rather than concrete infrastructure.
- PostgreSQL repository adapters own explicit SQL and persistence mappings.
- Shared schemas and inferred contracts replace duplicated public API DTOs.
- Tests assert the contract shape for successful responses.

## Authentication Standard

Protected user routes usually apply:

```ts
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
```

That stack means:

- DPoP validates the request proof.
- Authentication validates JWT claims, DPoP token binding, token version, and verified user state.
- Authorization validates route role metadata.
- Presentation passes the authenticated user ID to the use case. A database-backed use case opens its own RLS transaction through `UnitOfWork.execute(userId, operation)`. Public auth use cases pass `undefined`, remain `guest` until credentials or a signed token are verified, and can then promote the same transaction.

## Error Handling

Feature errors are transport-neutral and extend a shared application category such as not-found, validation, conflict, unauthorized, or forbidden. They contain no HTTP status code. `GlobalExceptionFilter` is the presentation-boundary adapter that maps those categories to HTTP responses.

`GlobalExceptionFilter` normalizes failures as:

```json
{
  "success": false,
  "message": "..."
}
```

Common status codes:

| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `400`  | Invalid request contract                                      |
| `401`  | Missing/invalid token, failed DPoP proof, stale token version |
| `403`  | Authenticated user lacks required role                        |
| `404`  | Missing resource or intentionally hidden bot/scanner path     |
| `426`  | Mobile app version is too old                                 |
| `429`  | Rate limit exceeded                                           |
| `500`  | Unexpected server failure                                     |

The filter logs exceptions with request, path, status, and user context where available.

## Observability Standard

The backend uses Pino for structured logs and Sentry for error/tracing visibility.

Request logging:

- Every request receives or propagates `x-request-id`.
- The request ID is returned in the response header.
- Logs include method, path, status, duration, app version, username header, and user ID after authentication.

Sentry:

- Initialized from `src/instrument.ts`.
- Tags include service name and request/user context.
- Expected client errors below 500 are filtered from Sentry events.
- Bot-blocked traffic is filtered from transactions.
- Video analysis propagates `sentry-trace` and `baggage` through S3 metadata into the Python worker.

## Caching And Realtime Standards

Redis is used for cache and Pub/Sub concerns. Cache-backed endpoints can expose `X-Cache: HIT|MISS` headers.

Socket.IO is used for authenticated realtime delivery. The API exposes a ticket route under `/api/websocket-tickets`; downstream realtime events can then target a user rather than broadcasting sensitive payloads.

## Data Access Standard

SQL is written explicitly inside PostgreSQL repository adapters using the `postgres` tagged-template client. Use cases see repository ports, not SQL helpers or database row types. The project avoids hiding important database behavior behind a generic ORM because the schema uses:

- domain schemas
- RLS policies
- security-invoker views
- hand-tuned indexes
- analytics-oriented projections

Drizzle defines tables, views, roles, policies, and migration snapshots; repositories retain explicit SQL where ownership, joins, projections, and performance implications need to remain visible.
