# CQRS Application And Persistence Refactoring Plan

## Status And Scope

This document records the structure implemented by the CQRS application and persistence refactor. The refactor is structural only; domain modeling remains a separate future phase.

Implementation is complete. Existing runtime behavior, SQL semantics, API contracts, Unit of Work boundaries, RLS propagation, and after-commit behavior were preserved.

## Objectives

- Establish one consistent feature structure across the project.
- Make the application read/write distinction explicit.
- Separate write-oriented repository ports from read-oriented query ports.
- Keep PostgreSQL, Drizzle, SQL, RLS, and transaction details in infrastructure.
- Preserve all application behavior, SQL logic, response shapes, errors, and transaction boundaries.
- Create a stable structure in which domain entities and policies can later be introduced selectively.

## Application Structure

Every feature should classify its entry-point use cases by behavior:

```text
application/
  commands/
    create-crew.use-case.ts
    update-crew.use-case.ts
    leave-crew.use-case.ts

  queries/
    list-crews.use-case.ts
    get-crew.use-case.ts
    list-crew-participants.use-case.ts

  services/

  ports/
    crews.repository.ts
    crews.queries.ts
    crew-image-storage.port.ts

  models/
  errors/
```

### Commands

A use case belongs under `application/commands/` when it changes application state or requests an external side effect. This classification does not depend on whether HTTP, a worker, an event listener, or a scheduled job invokes it.

Examples include creating a crew, replacing a workout plan, saving a workout session, enqueueing reminders, and sending a push notification.

### Queries

A use case belongs under `application/queries/` when it only obtains information and does not intentionally change application state.

Examples include listing crews, loading workout history, retrieving statistics, and finding an eligible push token.

Cache population performed after a successful read does not turn an application query into a command.

### Existing Use-Case Names

The structural refactor should preserve existing file and class names. For example, `CreateCrewUseCase` moves into `application/commands/` and `ListCrewsUseCase` moves into `application/queries/` without being renamed or behaviorally changed.

The existing use-case classes already perform the handler role. Do not introduce separate command/query message objects, handler classes, a command bus, or `@nestjs/cqrs` during this structural refactor.

## Application Services

`application/services/` is not a location for every use case that is not invoked by an HTTP controller. Invocation mechanism does not determine architectural responsibility.

An application service should contain reusable, stateless application orchestration that is shared by multiple command or query use cases and does not naturally belong to a domain entity or value object.

Suitable examples include:

- Building a shared authentication/session result used by multiple authentication commands.
- Coordinating a reusable workflow that several use cases invoke through the same application ports.
- Mapping a provider-neutral outcome into a shared application result when that policy is reused by multiple use cases.

The following do not belong in `application/services/` merely because they are not HTTP-triggered:

- Worker operations: they remain commands or queries.
- Event-listener operations: they remain commands or queries.
- Scheduled operations: they remain commands or queries.
- Pure business rules: they belong in domain entities, value objects, or policies.
- PostgreSQL, cache, queue, email, storage, token, or provider implementations: they belong in infrastructure.

If there is no genuinely shared application orchestration, the `services/` folder should not be created.

## Application Ports

Application ports are kept in one flat folder and distinguished by clear file names:

```text
application/ports/
  crews.repository.ts
  crews.queries.ts
  crew-image-storage.port.ts
  push-notification-sender.port.ts
  workout-plan-cache.port.ts
  workout-reminder-queue.port.ts
```

Do not force every outbound port into either repositories or queries. Storage, cache, queues, email, tokens, logging, events, and external providers retain their own clear categories.

### Repository Ports

Repository ports support command-side persistence and, later, domain aggregate persistence. They contain mutations and any reads needed specifically to complete a write workflow safely.

For example:

```ts
export abstract class CrewsRepository {
  public abstract create(...args: unknown[]): Promise<unknown>;
  public abstract update(...args: unknown[]): Promise<unknown>;
  public abstract getProfilePictureForUpdate(crewId: string): Promise<string | null | undefined>;
  public abstract updateProfilePicture(crewId: string, path: string | null): Promise<void>;
  public abstract leave(crewId: string): Promise<unknown>;
  public abstract delete(crewId: string): Promise<unknown>;
}
```

A read such as `getProfilePictureForUpdate` remains on the repository when its purpose is to support a command and it may need the same transactional guarantees.

### Query Ports

Query ports return application-owned read models optimized for display or reporting. They do not load domain entities merely to construct a response.

For example:

```ts
export abstract class CrewsQueries {
  public abstract list(...args: unknown[]): Promise<unknown>;
  public abstract listMine(...args: unknown[]): Promise<unknown>;
  public abstract findById(crewId: string): Promise<unknown>;
  public abstract listParticipants(...args: unknown[]): Promise<unknown>;
}
```

Command use cases depend on repository ports. Query use cases depend on query ports.

## Infrastructure Persistence Structure

Each feature should use the following consistent layout:

```text
infrastructure/
  persistence/
    postgres-crews.repository.ts
    postgres-crews.queries.ts
    crews.db-types.ts

    reads/
      list-crews.sql.ts
      list-my-crews.sql.ts
      get-crew.sql.ts
      list-crew-participants.sql.ts

    writes/
      create-crew.sql.ts
      update-crew.sql.ts
      update-crew-profile-picture.sql.ts
      leave-crew.sql.ts
      delete-crew.sql.ts
```

Naming infrastructure folders `reads/` and `writes/` distinguishes PostgreSQL implementation details from application CQRS commands and queries.

### SQL File Boundary

Use one SQL file per application operation, not one file per SQL statement.

A single operation may require several SQL statements. Those statements remain together when they collectively implement one atomic operation. For example, replacing a workout plan may create or update the plan, splits, exercise assignments, and sets in one write file.

Complex reporting queries, joins, JSON aggregation, pagination, row locking, bulk persistence, RLS enforcement, and concurrency-sensitive mutations remain in PostgreSQL infrastructure.

## Required Behavior Preservation

The structural refactor must not change:

- SQL text or query semantics.
- Parameters, casts, ordering, pagination, or return shapes.
- Public API contracts or controller behavior.
- Application error and outcome behavior.
- RLS roles or authenticated user propagation.
- `UnitOfWork.execute(...)` boundaries or nested transaction reuse.
- `UnitOfWork.afterCommit(...)` placement or behavior.
- Row locking and concurrency guarantees.
- Cache, queue, storage, email, event, or push behavior.

The PostgreSQL repository and query adapters should delegate to the moved SQL operations without adding business logic.

## Implementation Sequence

The implementation followed this sequence:

1. Classify existing use cases into application commands and queries.
2. Move them without renaming classes or changing behavior.
3. Keep application ports flat and distinguish their responsibilities through file names.
4. Split the existing application persistence port into a repository port and a query port where both reads and writes exist.
5. Add separate PostgreSQL repository and query adapters.
6. Move existing SQL unchanged into operation-level `reads/` and `writes/` files.
7. Update NestJS provider registrations and imports.
8. Verify that extracted SQL templates match the originals.
9. Run TypeScript, architecture lint, and the feature's integration tests.
10. Complete and verify the feature before starting another one.

Modules that are read-only or write-only do not need artificial empty repository or query abstractions.

## Domain Modeling Is A Separate Phase

Do not introduce entities or move business decisions out of SQL during this structural CQRS refactor.

After the structure is stable, domain entities or policies may be introduced selectively for deterministic business invariants. Read projections should continue using direct optimized SQL. RLS, locking, atomic persistence, and other concurrency-sensitive behavior should remain in PostgreSQL even when a domain policy participates in the decision.

## Architecture Assessment

This is a valid Clean Architecture, pragmatic CQRS, and DDD-compatible structure for this project because:

- Application owns its use cases and outbound port contracts.
- Infrastructure implements those contracts and owns SQL and Drizzle details.
- Presentation depends on application use cases rather than persistence.
- Commands and queries have visibly different dependencies.
- Read models can remain optimized instead of being forced through domain aggregates.
- The existing Unit of Work continues to give each use case an explicit RLS-aware transaction boundary.
- Domain modeling can be introduced where meaningful without requiring a rewrite of read-heavy modules.

It is not necessary to adopt a command bus, event sourcing, separate databases, or `@nestjs/cqrs` to use CQRS effectively here. Those mechanisms should be added only if the project develops a concrete need for them.
