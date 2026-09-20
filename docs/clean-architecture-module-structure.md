# Minimal Clean Architecture Module Structure

Use these layers for non-trivial features. The goal is dependency separation, not creating every possible abstraction.

```text
feature/
  domain/
    feature.entity.ts
    feature.errors.ts
  application/
    use-cases/
      action.use-case.ts
    feature.repository.ts
  infrastructure/
    postgres-feature.repository.ts
    feature.db-types.ts
    feature.sql.ts
  presentation/
    feature.controller.ts
  feature.module.ts
```

## Responsibilities

- `domain/`: Entities and business rules. Add value objects, domain services, and events only when the feature needs them. It must not depend on NestJS, HTTP, PostgreSQL, Drizzle, Redis, or queues.
- `application/`: Use-case classes and ports such as repository, cache, queue, and storage abstractions. It may depend on the domain, but not on concrete infrastructure.
- `infrastructure/`: PostgreSQL repositories, raw SQL, Drizzle-derived row types, Redis implementations, queues, storage, and mappings to domain/application types.
- `presentation/`: Controllers, request validation, authentication decorators, HTTP error mapping, and optional response presenters.
- `feature.module.ts`: The composition root that connects application ports to infrastructure implementations.

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

Add TSDoc above every controller handler and every public use-case method. Explain the operation, every parameter, and the return value. Document thrown errors when they are meaningful.

Controller handlers must additionally state the complete API path and access requirement:

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

Use-case methods use the same documentation standard but must not mention an API route, because the application layer is transport-independent:

```ts
/**
 * Retrieves the active workout plan for a user.
 *
 * @param userId - The user whose active plan is requested.
 * @param timeZone - The IANA time zone used for date calculations.
 * @returns The active workout plan, or `null` when none exists.
 */
```

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

## Infrastructure Ports and Naming

Every infrastructure capability used directly by a use case must be accessed through an application-owned port. Use abstract classes so the same declaration serves as the TypeScript contract and Nest injection token. Do not use `I` prefixes or names such as `Interface`, `Manager`, or `Helper`.

Name ports by the capability the application needs, without technology names:

```text
application/ports/
  workout-plan.repository.ts  -> WorkoutPlanRepository
  workout-plan-cache.port.ts  -> WorkoutPlanCache
  transaction-hooks.port.ts   -> TransactionHooks
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
DbTransactionHooks
ResendEmailSender
S3ObjectStorage
BullNotificationQueue
SystemClock
UuidIdGenerator
```

Register each adapter in the Nest module:

```ts
{
  provide: TransactionHooks,
  useClass: DbTransactionHooks,
}
```

Create a port only when application/domain code needs the capability. Raw SQL helpers, `DBService`, Redis clients, SDK clients, configuration loaders, and other details used entirely inside infrastructure do not need their own application ports. Critical post-commit delivery should eventually use a transactional outbox; `TransactionHooks.afterCommit(...)` is intended for cache operations and other best-effort side effects.
