# Clean Architecture + Hexagonal Architecture Module Structure

> **This is the required architecture for non-trivial backend features: Clean Architecture defines the inward dependency rule, while Hexagonal Architecture defines application-owned ports and replaceable inbound/outbound adapters.**

Use these layers for non-trivial features. The goal is dependency separation, not creating every possible abstraction.

```text
feature/
  domain/
    feature.entity.ts
    feature.errors.ts
  application/
    errors/
      feature.errors.ts
    models/
      feature.models.ts
    ports/
      feature.repository.ts
      dependency.port.ts
    use-cases/
      action.use-case.ts
  infrastructure/
    postgres-feature.repository.ts
    feature.db-types.ts
    feature.sql.ts
  presentation/
    feature.controller.ts
  feature.module.ts
```

This layout is required for refactored features. Do not place application models, errors, ports, or use cases directly in the feature root or directly in `application/`.

## Responsibilities

- `domain/`: Entities and business rules. Add value objects, domain services, and events only when the feature needs them. It must not depend on NestJS, HTTP, PostgreSQL, Drizzle, Redis, or queues.
- `application/`: Use-case classes and ports such as repository, cache, queue, and storage abstractions. It may depend on the domain, but not on concrete infrastructure.
- `infrastructure/`: PostgreSQL repositories, raw SQL, Drizzle-derived row types, Redis implementations, queues, storage, and mappings to domain/application types.
- `presentation/`: Controllers, request validation, authentication decorators, HTTP error mapping, and optional response presenters.
- `feature.module.ts`: The composition root that connects application ports to infrastructure implementations.

## Compound Features and Submodules

When a feature contains independently usable capabilities, split it into submodules. Each submodule follows the same `application/`, `infrastructure/`, `presentation/`, and optional `domain/` layout and owns its ports, use cases, adapters, controller, and `*.module.ts`.

```text
feature/
  core/
    application/
      errors/
      models/
      ports/
    infrastructure/
    feature-core.module.ts
  capability-a/
    application/
      errors/
      models/
      ports/
      use-cases/
    infrastructure/
    presentation/
    capability-a.module.ts
  capability-b/
    ...
  feature.module.ts
```

Use `core/` only for dependencies genuinely shared by multiple submodules. The top-level feature module only composes and re-exports submodules; it must not contain controllers, SQL classes, use cases, or adapter registrations.

## Add Only When Needed

- Use an entity when a concept has identity, behavior, or invariants; do not create one per table.
- Use an application model for a read projection that is not an entity, such as a feed, history, statistics, or catalogue result.
- Add a mapper or presenter only when conversion is substantial or reused.
- Small read-only features may have no `domain/` folder.
- New application operations use explicit `*.use-case.ts` classes with an `execute(...)` method. Existing services are migrated to use cases feature by feature rather than through a single large rewrite.

## Class-First Convention

Use classes for runtime architectural components: entities, domain services, use cases, repository and other port tokens, infrastructure adapters, controllers, and presenters. This supports encapsulation and Nest dependency injection.

Each application operation should normally have a dedicated use-case class, for example `GetWorkoutPlanUseCase`, `ReplaceWorkoutPlanUseCase`, or `CompleteWorkoutUseCase`. Controllers call the use case's `execute(...)` method; use cases coordinate domain rules and ports without depending on HTTP or concrete infrastructure.

Do not force classes onto data-only declarations. Zod schemas with inferred types remain the convention for shared contracts; interfaces/type aliases remain appropriate for commands, read models, SQL rows, configuration shapes, and event payloads. A class must provide behavior, encapsulation, construction rules, or act as an injection token - not merely duplicate fields.

## Required TSDoc

TSDoc is required for every exported runtime class, every controller handler, and every public use-case method. Documentation must explain intent and behavior rather than restating the method name.

### Classes

Add a concise class-level TSDoc summary to controllers, use cases, entities, domain services, ports, repositories, adapters, listeners, and presenters. Exported application models, events, and errors also require a short ownership or purpose description.

### Controller Handlers

Every controller handler must document:

- What the endpoint does.
- The complete HTTP method and path using `API: METHOD /full/path`.
- Its access requirement using `Access: ...`.
- Every handler parameter with `@param`.
- Its resolved response or absence of a response body with `@returns`.
- Expected errors with `@throws` when relevant. Put the error class in braces, for example `@throws {WorkoutPlanNotFoundError} When no active plan exists.` This is the project convention used by editor tooling; do not use `{@link ...}` in `@throws`.

Do not use only `@remarks Route`; use the explicit `API:` and `Access:` lines.

Example:

```ts
/**
 * Retrieves the authenticated user's active workout plan.
 *
 * API: GET /api/workout-plans
 * Access: Authenticated user
 *
 * @param user - The authenticated request user.
 * @param query - Validated filtering and time-zone parameters.
 * @returns The active workout plan response.
 */
```

### Use Cases

Every public `execute(...)` method must document:

- The application operation and meaningful behavior.
- Every input with `@param`.
- The resolved result with `@returns`, including `Promise<void>` operations.
- Every expected application/domain error with `@throws {ErrorClassName}`. Do not use TSDoc `{@link ...}` syntax in a `@throws` tag.

Use-case TSDoc must not mention HTTP methods, paths, status codes, controllers, or request/response objects because the application layer is transport-independent:

```ts
/**
 * Retrieves the active workout plan for a user.
 *
 * @param userId - The user whose active plan is requested.
 * @param timeZone - The IANA time zone used for date calculations.
 * @returns The active workout plan, or `null` when none exists.
 */
```

Expected errors use a symbol link so editors and generated documentation can navigate to the error declaration:

```ts
/**
 * Deletes a message visible to a user.
 *
 * @param messageId - The message to delete.
 * @param userId - The user requesting deletion.
 * @returns Nothing when deletion succeeds.
 * @throws {MessageNotFoundError} When the message is absent or inaccessible.
 */
```

Do not add documentation-only imports for error types. The braces form is the complete project convention.

### Avoid Redundant Documentation

Private helpers and trivial implementation overrides do not require repetitive TSDoc when the class or port already defines the contract. Comments must not claim behavior that the code does not provide. Update TSDoc whenever parameters, return values, access requirements, routes, or expected errors change.

## Error Convention

Every refactored feature or submodule that raises expected errors must own an `application/errors/` folder and a feature-specific `*.errors.ts` file. Do not centralize capability-specific errors in a parent or `core` module. Feature errors extend the appropriate transport-neutral application category (`ApplicationNotFoundError`, `ApplicationValidationError`, `ApplicationConflictError`, `ApplicationUnauthorizedError`, or `ApplicationForbiddenError`). The global exception filter maps those categories to HTTP status codes at the presentation boundary. Controllers call use cases directly; do not add per-controller `executeOperation` wrappers or repetitive `try/catch` mappings. Application errors must not contain HTTP status codes or extend Nest HTTP exceptions.

## Cross-Module Events

Use an event when one module reacts to a lifecycle occurrence owned by another module. Put the event name and payload class under `src/common/application/events/`, define an event-publisher port in the producing module, implement it in infrastructure, and keep the listener in the consuming module.

Use awaited publication (`emitAsync`) when existing behavior requires listener completion or error propagation. Do not replace an awaited call with fire-and-forget emission. Direct service imports across feature modules are not allowed when the dependency represents a reaction to an event; synchronous request/response capabilities may instead be exported as application ports.

The required dependency direction is:

```text
presentation -> application -> domain
infrastructure -> application/domain
```

## Type-System Refactor

Keep the existing shared-contract naming convention exactly; this refactor must not rename public schemas or inferred contract types. Continue names such as `listExercisesResponseSchema`, `replaceWorkoutPlanRequestSchema`, `ListExercisesResponse`, `ReplaceWorkoutPlanBody`, `GetWorkoutPlanQuery`, and `MarkMessageAsReadParams`. Only their dependency on Drizzle changes.

- `packages/shared`: Public request, response, and event Zod contracts consumed by the frontend or another process. Define them with ordinary Zod schemas; do not import Drizzle tables or database schemas.
- `infrastructure/`: Drizzle-derived row/insert/update types, SQL result types, and other persistence-only DTOs.
- `domain/`: Entities and value objects defined by business rules, never derived from Drizzle.
- `application/`: Repository inputs/outputs and read models when a domain entity or shared contract is not appropriate.

The intended conversion is:

```text
Drizzle/SQL type -> PostgreSQL repository -> domain entity or application model -> controller -> shared response
```

Migrate feature by feature: keep current contracts working, stop adding new Drizzle dependencies to `packages/shared`, then rewrite a feature's contracts with plain Zod and move its SQL-only types into that feature's infrastructure layer.

### SQL and Database Types

Keep SQL input/result rows and Drizzle-derived select/insert/update types in the module's infrastructure layer, normally in `feature.db-types.ts`. These types may import Drizzle tables and application models, but they must not be exported from `packages/shared` or used by domain/application ports. The adjacent `feature.sql.ts` imports them for typed database operations.

## Strict Type and DTO Placement

Treat each type as owned by exactly one boundary. Do not create a generic shared DTO layer inside the backend.

### Shared Package

`@strong-together/shared` exports only contracts that cross a process boundary:

- HTTP request and response Zod schemas and their inferred `Body`, `Query`, `Params`, and `Response` types.
- Public WebSocket event contracts.
- Queue or worker payload contracts only when another package or runtime consumes them.

Keep the existing public naming convention exactly, for example `loginRequestSchema`, `loginResponseSchema`, `LoginRequestBody`, `GetWorkoutPlanQuery`, and `DeleteMessageParams`. Feature `index.ts` files export only their `*.contracts.ts` files.

Shared contracts must use plain Zod and common transport schemas. They must not import Drizzle tables, database schemas, backend entities, application models, SQL types, repositories, internal JWT payloads, or infrastructure code. Do not export database rows, insert/update types, `*QueryDto` types, or internal token schemas from the shared package.

### Domain Types

Entities, value objects, domain errors, and domain events belong under the feature's `domain/` folder. They are defined from business rules and are never derived from Drizzle or HTTP contracts. Domain types are backend-internal unless a separate public contract explicitly represents the same concept.

### Application Types

Use `application/models/*.models.ts` for data-only inputs, commands, results, and read projections used by use cases and ports. Use interfaces or type aliases for these shapes; use classes only when behavior or construction rules exist. Repository and other port signatures use domain types or application models, never SQL rows or HTTP request types.

Do not suffix application types with `Dto`. Prefer names such as `AerobicEntryInput`, `AerobicsHistory`, `LoginResult`, `VisiblePostItem`, or `ReplaceWorkoutPlanCommand`.

Application code must not import public HTTP request or response types from `@strong-together/shared`. Use cases return domain entities or application models. The presentation layer owns the shared transport contract and may return a structurally compatible application result without copying it.

### Infrastructure Types

Use `infrastructure/persistence/*.db-types.ts`, or `infrastructure/*.db-types.ts` when persistence is the module's only infrastructure concern.

- All Drizzle type inference declarations belong in the applicable `*.db-types.ts` file. This includes `typeof table.$inferSelect`, `typeof table.$inferInsert`, `Pick`/`Omit` based on those inferred types, and indexed access into inferred rows. Do not declare these types in SQL classes, repositories, application models, domain files, controllers, or `packages/shared`.
- Database-derived Zod inference also belongs to backend infrastructure. If an infrastructure adapter genuinely needs `createSelectSchema`, `createInsertSchema`, or `createUpdateSchema` from `drizzle-zod`, declare the resulting schema beside its persistence types in the applicable `*.db-types.ts` file. Never place or export a Drizzle-derived Zod schema from `packages/shared`.
- A refactored feature's shared contract must recreate its public validation with ordinary Zod primitives and reusable transport schemas. It must not reuse a backend database schema even when the current field constraints happen to match.
- Derive complete table rows and table-column selections from Drizzle with `$inferSelect`, `$inferInsert`, `Pick`, or `Omit`.
- SQL result fields that directly originate from a Drizzle table column must reuse that column's inferred type, including selected columns that SQL aliases. Use `Pick<typeof table.$inferSelect, ...>` when property names are unchanged, or indexed access such as `(typeof table.$inferSelect)['sentAt']` when an aliased/custom result interface needs the field under another name.
- Define only genuinely computed fields, function results, JSON aggregations, and fields whose runtime type changes because of a SQL expression manually. For joins, derive each direct column from its owning table and explicitly add `null` when the join can make the row absent.
- Do not define primitive copies such as `{ id: string }` when `Pick<typeof message.$inferSelect, 'id'>` is available. Do not alias an application model as a SQL row merely because their current shapes match; persistence types must express the database result independently, and the repository maps them to application models.
- Name persistence types by their actual role, such as `UserDbRow`, `WorkoutPlanDbInsert`, `LoginUserSqlRow`, or `AerobicsHistorySqlRow`.
- Keep internal JWT validation schemas, provider SDK results, Redis representations, and adapter-only payloads beside their infrastructure adapter.

Infrastructure types are private to the backend and must not be re-exported through the shared package.

### DTO Naming

Use `DTO` only for a real transport object crossing a process boundary. Public HTTP types continue using the existing contract naming rather than adding `Dto`. SQL results are `*SqlRow`, Drizzle records are `*DbRow`/`*DbInsert`, application values are `*Input`/`*Command`/`*Result`/descriptive model names, and event data is `*Event` or `*Payload`.

### Required Data Flow

```text
Drizzle/table type or manual SQL row
  -> infrastructure repository mapping
  -> domain entity or application model
  -> presentation/controller mapping when needed
  -> shared response contract
```

Matching shapes do not require runtime copying: TypeScript structural typing allows a controller to return an application model when it already satisfies the shared response type. Add a mapper or presenter only when fields, formats, visibility, or semantics differ.

Migrate feature by feature. Existing unmigrated exports may remain temporarily, but a refactored feature must remove its database/query DTO exports from `packages/shared` and expose only its public contracts.

## Infrastructure Ports and Naming

Every infrastructure capability used directly by a use case must be accessed through an application-owned port. Use abstract classes so the same declaration serves as the TypeScript contract and Nest injection token. Do not use `I` prefixes or names such as `Interface`, `Manager`, or `Helper`.

Name ports by the capability the application needs, without technology names:

```text
application/ports/
  workout-plan.repository.ts  -> WorkoutPlanRepository
  workout-plan-cache.port.ts  -> WorkoutPlanCache
  unit-of-work.port.ts        -> UnitOfWork
  email-sender.port.ts        -> EmailSender
  object-storage.port.ts      -> ObjectStorage
  event-publisher.port.ts     -> EventPublisher
  notification-queue.port.ts  -> NotificationQueue
  clock.port.ts               -> Clock
  id-generator.port.ts        -> IdGenerator
  password-hasher.port.ts     -> PasswordHasher
  token-issuer.port.ts        -> TokenIssuer
```

Repositories keep the `*.repository.ts` filename and `Repository` class suffix. All other outbound ports use `*.port.ts`, while the class name remains the concise business capability without a `Port` suffix.

Name infrastructure adapters by their technology or mechanism:

```text
PostgresWorkoutPlanRepository
RedisWorkoutPlanCache
PostgresUnitOfWork
ResendEmailSender
S3ObjectStorage
BullNotificationQueue
SystemClock
UuidIdGenerator
```

### External Adapter Naming

Preserve the application port's business role as the adapter class suffix and add the delivery mechanism as a prefix. Do not switch between synonyms such as `Publisher`, `Emitter`, `Broadcaster`, `Notifier`, or `Sender` for the same port role.

| External mechanism                         | Application port type   | Infrastructure adapter type   | File name                          | Wrapped dependency field and type                   |
| ------------------------------------------ | ----------------------- | ----------------------------- | ---------------------------------- | --------------------------------------------------- |
| Socket delivery                            | `<Capability>Publisher` | `Socket<Capability>Publisher` | `socket-<capability>.publisher.ts` | `publisher: SocketIOService`                        |
| Queue-backed delivery for a publisher port | `<Capability>Publisher` | `Queued<Capability>Publisher` | `queued-<capability>.publisher.ts` | `<capability>Producer: <Capability>ProducerService` |
| Queue-backed email sending                 | `<Purpose>EmailSender`  | `Queued<Purpose>EmailSender`  | `queued-<purpose>-email.sender.ts` | `emailsProducer: EmailsProducerService`             |

Concrete examples:

```text
MessagePublisher          -> SocketMessagePublisher
MessagePublisher          -> QueuedMessagePublisher
VerificationEmailSender   -> QueuedVerificationEmailSender
PasswordResetEmailSender  -> QueuedPasswordResetEmailSender
```

The constructor property name describes the wrapped external dependency consistently:

```ts
export class SocketMessagePublisher implements MessagePublisher {
  constructor(private readonly publisher: SocketIOService) {}
}

export class QueuedVerificationEmailSender implements VerificationEmailSender {
  constructor(private readonly emailsProducer: EmailsProducerService) {}
}
```

For socket publisher adapters, the wrapped `SocketIOService` property is always named `publisher`. For queue adapters, retain the producer's capability name and `Producer` suffix (for example `emailsProducer: EmailsProducerService`); do not call a queue producer `queue`, `client`, or `service`. The port token, injected use-case property, adapter class, and file must keep the same business-role noun.

Register each adapter in the Nest module:

```ts
{
  provide: UnitOfWork,
  useClass: PostgresUnitOfWork,
}
```

Database-backed use cases own their transaction by calling `UnitOfWork.execute(userId, operation)`. Presentation supplies the authenticated user ID; public authentication use cases pass `undefined` to start with the guest role. Use `UnitOfWork.afterCommit(...)` inside the operation for cache updates, queue publication, storage cleanup, and other best-effort work that must not happen before commit. Nested use cases reuse the active transaction.

`PostgresUnitOfWork` delegates to the infrastructure-only `DBService`, which owns PostgreSQL, RLS setup, `AsyncLocalStorage`, and the transaction-scoped SQL tag. Repository SQL must use `DBService.sql`; it throws outside an active unit of work. Critical guaranteed delivery should eventually use a transactional outbox rather than an after-commit callback.

Create a port only when application/domain code needs the capability. Raw SQL helpers, `DBService`, Redis clients, SDK clients, configuration loaders, and other details used entirely inside infrastructure do not need their own application ports.

### Cache Ports and Keys

Follow the aerobics cache pattern in every refactored feature:

- Application use cases never construct or receive cache-key strings, Redis namespaces, cache versions, or TTL values.
- The application cache port accepts business parameters such as `userId`, `days`, and `timezone` and returns a typed cache entry with `get()` and `set(value)` methods.
- The infrastructure cache adapter owns the namespace, version, TTL, and stable-key builder. Export the stable-key builder only when integration tests need to inspect the physical cache entry.
- Resolve the cache entry once in the use case, read it when caching is enabled, and reuse the same entry when scheduling the post-commit write.
- Cache invalidation remains a business-level port method such as `invalidateUser(userId)`.

```ts
export interface AerobicsCacheEntry {
  get(): Promise<AerobicsHistory | null>;
  set(value: AerobicsHistory): Promise<void>;
}

export abstract class AerobicsCache {
  abstract forUser(userId: string, days: number, timezone: string): Promise<AerobicsCacheEntry>;
  abstract invalidateUser(userId: string): Promise<void>;
}
```

Do not expose generic `get(userId, key)` or `set(userId, key, value)` methods from application cache ports, and do not build strings such as `` `exercise-history:${days}:${timezone}` `` inside use cases.

## Refactored Feature Completion Checklist

A feature is refactored only when all applicable items below are true:

- Files follow the required layer/subfolder layout; compound capabilities own their own module, ports, use cases, adapters, and presentation.
- The top-level module of a compound feature only imports and re-exports submodules.
- Controllers depend on use cases; use cases depend only on domain code, application models, and application-owned ports.
- Every application operation is an explicit use-case class with an `execute(...)` method.
- Concrete databases, caches, queues, sockets, SDKs, and transaction mechanisms remain in infrastructure and are reached through application ports when a use case uses them directly.
- Cache ports return typed cache entries from business parameters; application code contains no physical cache keys, namespaces, versions, or TTLs.
- Expected errors are feature-owned, transport-neutral application errors categorized by shared application base classes; the global HTTP filter owns status mapping and controllers do not translate errors with repetitive `try/catch` blocks.
- Lifecycle reactions across modules use the common event, a producer-owned publisher port, an infrastructure publisher, and a consumer-side listener. Awaited behavior remains awaited.
- Shared feature indexes export only public `*.contracts.ts`; shared contracts use plain Zod and contain no Drizzle, `drizzle-zod`, `$inferSelect`, `$inferInsert`, SQL-row, database, backend model, or internal-token types.
- Application ports use domain entities or application models—not SQL rows or shared HTTP contracts.
- SQL result types and every Drizzle type/schema inference declaration live in the feature's infrastructure `*.db-types.ts` file. Every direct table-column field derives its type from Drizzle; only computed or runtime-transformed fields are manually typed. Repositories map SQL rows to domain/application values, including date serialization or other representation changes.
- Public contract names and behavior remain unchanged unless the task explicitly changes the API.
- Exported runtime classes, exported application models/events/errors, controller handlers, and public use-case methods have the required TSDoc. Every expected error uses `@throws {ErrorClassName}` and never `{@link ...}`.
- Relevant shared builds, TypeScript checks, and feature tests pass.
