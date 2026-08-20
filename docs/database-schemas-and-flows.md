# Database Schemas And Flows

The database is PostgreSQL-first and organized around domain schemas rather than a single overloaded `public` namespace. The active Drizzle migrations live in `src/infrastructure/db/schema/drizzle-migrations`, and seeds live in `src/infrastructure/db/schema/seeds`.

The ERDs are generated from the reviewed DBML sources under `docs/db-diagrams/source`. Run `npm run docs:db-diagrams` after a schema change and review both the DBML diff and rendered SVG. The Drizzle TypeScript schema and committed migrations remain authoritative.

## Chen ERD

![Chen ERD](media/dberd.png)

## Schema Map

| Schema      | Main objects                                                                            | Responsibility                                                                           |
| ----------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `identity`  | `user`, `oauth_account`, `current_user_id()` support                                    | User profile, credentials metadata, roles, verification, OAuth linkage, token versioning |
| `workout`   | `exercise`, `workout_plan`, `workout_split`, `exercise_to_workout_split`, `workout_set` | Exercise catalog and planned workout structure                                           |
| `tracking`  | `workout_summary`, `exercise_tracking`, `tracking_set`, `aerobic_tracking`              | Completed workout sessions, set-level strength data, aerobic history                     |
| `reminders` | `user_reminder_setting`, `user_split_information`                                       | Reminder preferences and inferred split scheduling data                                  |
| `messages`  | `message`                                                                               | User/system messaging                                                                    |
| `analytics` | `v_exercise_tracking_expanded`, `v_prs`                                                 | Security-invoker, read-optimized tracking and personal-record views                      |
| `guest_api` | allow-listed `SECURITY DEFINER` functions                                               | Narrow database API for unauthenticated authentication and registration flows            |

## Identity Schema

### Tables

![Identity Schema](./db-diagrams/identityschema.svg)

`identity.user` is the security anchor for the application. It stores user identity, role, verification state, password data, profile fields, `token_version`, and `last_login`.

Important flows:

- Login bumps `token_version` and returns access/refresh tokens with the new version.
- Refresh performs a version compare-and-set before issuing new tokens.
- Logout bumps `token_version`, invalidating older access tokens.
- Verification and password flows update identity state while preserving centralized token invalidation.
- `identity.oauth_account` links provider identities to application users.
- A null `last_login` is the only first-login indicator and triggers the initial system message before login updates the timestamp.

The schema is protected by RLS so authenticated users can read/update/delete only their own profile, with specific exceptions such as message sender visibility.

Guest never receives direct access to `identity` tables. Public auth code calls the allow-listed functions in `guest_api`; after credentials or a signed token are verified, the request transaction is promoted to the authenticated user's RLS context.

## Workout Schema

### Tables

![Workout Schema](./db-diagrams/workoutschema.svg)

### Tracking-to-analytics view dependencies

![Workout views Schema](./db-diagrams/workoutviewsschema.svg)

The workout schema separates reusable exercise definitions from user-specific plans.

Core objects:

- `workout.exercise`: exercise catalog readable by authenticated users.
- `workout.workout_plan`: plan owned by a user.
- `workout.workout_split`: split/day definitions under a plan.
- `workout.exercise_to_workout_split`: ordered exercises inside a split.
- `workout.workout_set`: normalized prescribed reps for each ordered set.
- `workout.v_exercise_to_workout_split_expanded`: security-invoker, row-expanded view of exercise assignments and their normalized prescribed sets. API queries aggregate these rows into arrays and camelCase response objects.

Why this shape matters:

- Exercise metadata stays normalized.
- User plans can evolve without duplicating the catalog.
- Ordered split exercises support practical workout UX.
- RLS policies tie nested split/exercise rows back to the owning plan.

## Tracking Schema

### Tables

![Tracking Schema](./db-diagrams/trackingschema.svg)

### Views

![Tracking Views Schema](./db-diagrams/trackingviewsschema.svg)

The tracking schema captures performed activity, not planned activity.

Core objects:

- `tracking.workout_summary`: a completed workout session.
- `tracking.exercise_tracking`: completed exercise linked to a workout summary.
- `tracking.tracking_set`: normalized reps and weight for each completed set.
- `tracking.aerobic_tracking`: cardio history.

Important indexes:

- `workout_summary_user_start_utc_idx` supports user timeline queries.
- `workout_summary_start_date_idx` supports date-based grouping.
- `exercise_tracking_workout_summary_id_idx` supports session detail expansion.
- `aerobic_tracking_user_id_workout_time_utc_idx` supports cardio history reads.

The RLS model protects nested set rows by checking ownership through `workout_summary`.

## Analytics Schema

### Views

![Analytics Schema](./db-diagrams/analyticsschema.svg)

Analytics is modeled through security-invoker views:

- `analytics.v_exercise_tracking_expanded`
- `analytics.v_prs`

Security-invoker views are an important choice because they preserve caller RLS behavior. Analytics queries can be expressive and reusable without accidentally becoming privileged read paths.

The API uses these views for higher-level fitness insights such as personal records, RM-oriented data, and goal adherence.

## Reminders Schema

### Tables

![Reminders Schema](./db-diagrams/reminderschema.svg)

Reminder data is split between explicit settings and inferred schedule intelligence:

- `reminders.user_reminder_setting`: user-owned reminder preferences.
- `reminders.user_split_information`: preferred weekday and confidence data for split scheduling.

The confidence index on `preferred_weekday` and `confidence` exists because reminders are not just CRUD settings; they are time-sensitive operational queries.

## Messages Schema

### Tables

![Messages Schema](./db-diagrams/messagesschema.svg)

`messages.message` supports user and system messages.

RLS allows participants to read/update/delete messages where they are sender or receiver. Insert policy also allows a known system sender ID, which supports automated application messages without giving every user broad write access.

## RLS Flow

Unauthenticated auth flow:

```text
HTTP request -> RlsTxInterceptor -> guest transaction -> guest_api function
             -> credential/token verification -> authenticated transaction context
```

`guest` has no application-table grants and no guest RLS policies. `guest_api` functions are the only database entry points available before authentication.

Authenticated controller routes use `RlsTxInterceptor`:

```text
HTTP request -> AuthenticationGuard -> req.user.id -> RlsTxInterceptor -> DB transaction
```

Inside the transaction:

```sql
SELECT
  SET_CONFIG('app.current_user_id', < user - id >, TRUE);

SET
  LOCAL ROLE authenticated;
```

Queries then execute against PostgreSQL policies that call `identity.current_user_id()` or related helpers. The application and database agree on the same current user.

## Migration Lifecycle

Normal schema workflow:

```bash
npm run db:dev:start
npm run db:migrate:diff -- add_feature_name
npm run db:dev:migrate
npm run test:db:reset
```

The key engineering rule: schema state must be reproducible from committed Drizzle migrations. Local mutations are not the source of truth until the Drizzle schema and generated migration capture them.
