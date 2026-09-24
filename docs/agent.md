# Clean Architecture Refactoring Plan

## Purpose

This document records the agreed next refactoring work and the decisions that are intentionally out of scope. It is a plan only. Creating this document does not authorize or apply production, CI, or test changes.

## Approved Work

### 1. Enforce architecture boundaries and run the check in CI - Completed

Keep this implementation short and simple:

- Add an architecture-focused lint configuration, using import-boundary rules rather than a custom architecture framework.
- Reject imports from `application/` or `domain/` into `presentation/` or feature `infrastructure/`.
- Reject imports from `domain/` into NestJS, application, presentation, or infrastructure code.
- Reject imports from one feature into another feature's infrastructure implementation.
- Reject backend and Drizzle imports from `packages/shared`.
- Add a dedicated `lint:architecture` package script.
- Run `npm run lint:architecture` in `.github/workflows/ci.yml` after dependency installation and before the test suite.

The initial rule set should cover existing architectural intent without introducing unrelated formatting or general lint cleanup.

Implemented in the typed `eslint.config.ts`. The dedicated `lint:architecture` script runs in CI before the test suite and currently passes for the repository.

### 2. Split oversized SQL classes

Split these infrastructure classes by cohesive query or command:

- `src/modules/workout/tracking/infrastructure/workout-tracking.sql.ts`
- `src/modules/workout/plan/infrastructure/workout-plan.sql.ts`
- `src/modules/social/crews/infrastructure/crews.sql.ts`

Guidelines:

- Preserve SQL behavior, transaction participation, RLS behavior, return shapes, and public application ports.
- Keep complex aggregation in PostgreSQL where it is currently appropriate.
- Group files under infrastructure `queries/` and `commands/` when that makes the responsibility clear.
- Keep the PostgreSQL repository as the adapter implementing the application-owned repository port.
- Register the new query and command classes in the existing Nest feature module.
- Avoid changing controllers, use-case APIs, shared contracts, or observable endpoint behavior.

Suggested workout-tracking split:

- `workout-history.query.ts`
- `exercise-history.query.ts`
- `workout-statistics.query.ts`
- `personal-records.query.ts`
- `create-workout-session.command.ts`

The exact split should follow the existing methods rather than force every SQL statement into its own class.

### 3. Remove the HTTP-contract dependency from reactions infrastructure

`reactions.sql.ts` must not use `ReactToPostBody` from `@strong-together/shared`.

For the infrastructure SQL type, derive the reaction enum from Drizzle, for example through the inferred reaction row type (`ReactionDbRow['type']`) in `reactions.db-types.ts`. The SQL adapter should consume that infrastructure-owned inferred type. Preserve the existing application model and public contract unless a compatibility issue requires an explicit mapping.

### 4. Refactor Expo push delivery to use an outcome and application error - Completed

Implement the same adapter-outcome/use-case-error pattern already used by workout plan, workout schedule, posts, comments, and crews.

#### Application model

Add the input and outcome under the push application models:

```ts
export type PushNotificationInput = {
  token: string;
  title: string;
  body: string;
};

export type SendPushNotificationOutcome =
  { kind: 'sent'; ticketId: string | null } | { kind: 'permanent-failure'; reason: string } | { kind: 'temporarily-unavailable'; reason: string };
```

#### Application port

Add `application/ports/push-notification-sender.port.ts`:

```ts
export abstract class PushNotificationSender {
  public abstract send(input: PushNotificationInput): Promise<SendPushNotificationOutcome>;
}
```

#### Infrastructure adapter

Replace the standalone `sendPushNotification` function with an injectable `ExpoPushNotificationSender` implementing `PushNotificationSender`.

The adapter must return outcomes instead of throwing Nest HTTP exceptions:

- Successful Expo ticket -> `{ kind: 'sent', ticketId }`.
- Invalid token, rejected device token, or another permanent Expo rejection -> `{ kind: 'permanent-failure', reason }`.
- HTTP 429, HTTP 5xx, timeout, connection failure, or transient Expo code -> `{ kind: 'temporarily-unavailable', reason }`.

The adapter may still throw an unexpected programming error that it cannot classify, but it must not import `ServiceUnavailableException` or any other presentation exception.

#### Application error and presentation mapping

Add `ApplicationServiceUnavailableError` to the common transport-neutral application error categories. Map that category to HTTP 503 in `GlobalExceptionFilter`, consistently with the existing mappings for not-found, validation, conflict, authentication, and authorization errors.

Add a push-specific error such as:

```ts
export class PushDeliveryTemporarilyUnavailableError extends ApplicationServiceUnavailableError {
  public constructor(reason: string) {
    super(`Push delivery is temporarily unavailable: ${reason}`);
  }
}
```

#### Use case

Add `SendPushNotificationUseCase`:

- Call `PushNotificationSender.send(...)`.
- Return the `sent` result.
- Return `permanent-failure` so the worker can log and finish without retrying.
- Convert `temporarily-unavailable` into `PushDeliveryTemporarilyUnavailableError`.

The infrastructure adapter therefore describes what happened, while the use case decides which application failure should be raised.

#### Worker and composition

- Inject `SendPushNotificationUseCase` into `PushNotificationsWorkerService`.
- Remove the worker's direct import of `expo-push.sender.ts`.
- When the use case returns `sent`, log success.
- When it returns `permanent-failure`, log a non-retryable warning and complete the Bull job.
- When it throws `PushDeliveryTemporarilyUnavailableError`, keep the existing worker error reporting and rethrow it so Bull applies the configured retry policy.
- Register `ExpoPushNotificationSender` for the `PushNotificationSender` port and register `SendPushNotificationUseCase` in `PushNotificationsWorkerModule` (or import a narrowly scoped module exporting those providers).

No controller is needed for this flow. The HTTP 503 mapping keeps the shared application-error convention complete if this capability is later invoked through an HTTP presentation adapter.

## Decisions: Do Not Change

The following are explicit project tradeoffs or current scope decisions:

- Keep NestJS `@Injectable()` usage in the application layer.
- Do not split or otherwise refactor `CrewsController`.
- Do not add application-layer unit tests at this time.
- Do not add domain-layer unit tests at this time.
- Do not change the current crews image-upload flow. The use case already accepts the application-owned `CrewImageUpload` shape; the controller's `Express.Multer.File` is structurally compatible with it.

Existing integration/controller tests should continue to pass after approved implementation work, but expanding unit-test scope is not part of this plan.

## Implemented Unit of Work

Database-backed use cases explicitly own their transaction through the application `UnitOfWork` port:

```ts
export abstract class UnitOfWork {
  public abstract execute<T>(userId: string | undefined, operation: () => Promise<T>): Promise<T>;
  public abstract afterCommit(operation: () => Promise<void>): void;
}
```

Presentation authenticates the request and passes the user ID into the use case, but it does not know about transactions. Public authentication use cases pass `undefined` and promote the active transaction after credentials or a signed token are verified.

`PostgresUnitOfWork` is the infrastructure adapter. It delegates to `DBService.withRlsTransaction`, which opens, commits, or rolls back the PostgreSQL transaction; applies the RLS role and identity; stores the transaction-scoped SQL client in `AsyncLocalStorage`; and runs registered after-commit callbacks only following a successful commit.

The runtime flow is:

```text
Controller or worker -> use case
  -> UnitOfWork.execute(userId, operation)
    -> PostgresUnitOfWork
      -> DBService.withRlsTransaction
        -> repositories share DBService.sql
      -> commit
      -> registered after-commit work
```

Nested database-backed use cases reuse the active transaction. `DBService.sql` throws outside an active unit of work, so forgotten transaction boundaries fail immediately. Use `afterCommit` for best-effort cache, queue, or storage side effects; guaranteed delivery requires a transactional outbox.

The former request-wide `RlsTxInterceptor` and separate `TransactionHooks` abstraction have been removed.

## Design Discussion Only - Not Yet Approved for Implementation

### Selective domain modeling

Do not create entities that merely mirror database tables. Domain types are useful only where behavior and invariants can be expressed independently of HTTP and PostgreSQL.

Potential candidates are:

- A workout-session model that validates tracked sets, indices, time ordering, and completion rules before persistence.
- A workout-schedule value object that enforces valid weekday/split combinations and duplicate rules.
- A reminder-scheduling policy that calculates eligibility, delivery time, delay, and expiry from schedule and time-zone inputs.
- A crew-membership policy for role transitions where decisions can be made without sacrificing the database transaction and concurrency guarantees.

Crew leadership transfer and similar concurrency-sensitive operations should remain atomic in PostgreSQL. A domain policy may describe valid transitions, while the repository and SQL implementation still perform the authoritative locked/atomic update and return an application outcome.

The recommended first candidate is reminder scheduling because it is deterministic, has meaningful business rules, and does not require loading a large aggregate. No domain extraction should be implemented until a specific invariant and ownership boundary are agreed.

## Remaining Execution Order

For the remaining approved work, use this order:

1. Fix the reactions infrastructure type dependency.
2. Split the three oversized SQL classes one module at a time, verifying existing tests after each module.
