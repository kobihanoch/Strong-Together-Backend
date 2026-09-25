# Domain Refactoring Rules

1. Do not change business behavior, API contracts, transaction boundaries, or SQL behavior during a domain refactor.
2. Add a `domain/` folder to each relevant feature, with `entities/` and `value-objects/` folders.
3. Put business invariants and validation in domain entities and value objects.
4. Keep domain code independent of NestJS, HTTP, databases, Redis, and infrastructure code.
5. Use entities for concepts with identity, behavior, or aggregate-level rules.
6. Use immutable value objects for validated domain values. Prefer a validating constructor when creation is simple; use a named factory only when it adds value.
7. Application use cases create domain objects and pass them to repository ports.
8. PostgreSQL repositories map domain objects to persistence-ready primitive values.
9. SQL classes accept primitive persistence inputs and contain no domain mapping or business rules.
10. Avoid mapping when the value already has the required persistence shape.
11. Keep ownership, concurrency, locking, and atomic consistency checks in the database when they depend on current persisted state.
12. Add focused domain tests for every extracted invariant and run type checking, linting, and existing behavior tests.
