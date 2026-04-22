# Security Deep Dive

Security in Strong Together is layered across the HTTP edge, token lifecycle, route authorization, request validation, and PostgreSQL RLS.

## Server-Side Middleware

Global middleware is registered in `src/app.ts` and applies to all routes.

| Layer | Purpose | Why it matters |
| --- | --- | --- |
| `GeneralRateLimitMiddleware` | In-memory route/client throttling | Reduces brute-force and noisy client abuse before controller code runs |
| `RequestLoggerMiddleware` | Request IDs, structured logs, Sentry context | Makes incident investigation possible across API and async flows |
| `BotBlockerMiddleware` | Blocks missing user agents, scanner paths, suspicious accept headers, and known automation clients | Reduces exposure to commodity internet scanning |
| `CheckAppVersionMiddleware` | Enforces `x-app-version` for non-exempt routes | Allows the backend to retire unsafe or incompatible client versions |
| `helmet()` | Security headers | Hardens common browser-facing attack surfaces |
| CORS configuration | Restricts origin/methods/headers | Limits browser-based cross-origin access to intended clients |

The edge policy is intentionally conservative. The mobile app is the primary client, so missing app-version headers and browser-like scanner traffic are treated as suspicious except for explicit public callback/health routes.

## DPoP Proof Validation

`DpopGuard` implements proof-of-possession validation when `DPOP_ENABLED` is active.

It verifies:

- A `DPoP` proof is present.
- The proof uses `typ=dpop+jwt`.
- The proof is signed with `ES256`.
- The embedded JWK is `EC P-256`.
- `htm` matches the actual HTTP method.
- `htu` matches an allowed origin and request path.
- `iat` is fresh within the configured window.
- `jti` exists and has not already been used.
- The JWK thumbprint is calculated and attached to the request as `dpopJkt`.
- The access token hash claim (`ath`) is retained for token binding checks.

Replay attack protection is handled through the cache layer: each DPoP `jti` is stored with a short TTL. Reusing the same proof fails even if the JWT signature is valid.

## JWT Binding And Token Versioning

Authentication is split between proof validation and token validation:

1. `DpopGuard` proves the caller holds the private key for the request.
2. `AuthenticationGuard` extracts and decodes the access token.
3. The token `cnf.jkt` claim must match the DPoP JWK thumbprint.
4. The `ath` claim must match the hash of the access token.
5. The token `tokenVer` claim must match `identity.users.token_version`.
6. The user must exist and be verified.

Token versioning gives the backend central revocation without maintaining a token blacklist. Login, refresh, password-sensitive flows, and logout can bump `token_version`, making older access and refresh tokens fail with `New login required`.

Refresh rotation uses a compare-and-set style update: the refresh token's previous version must match the database version before the server issues a new pair. This prevents stale refresh tokens from being replayed successfully after rotation.

## Authorization

`AuthorizationGuard` checks route metadata created by `@Roles(...)`. Most protected product routes use:

```ts
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
```

This makes authentication, proof-of-possession, and role authorization explicit at the controller boundary.

## Request Validation

`ValidateRequestPipe` validates request data with schemas imported from `@strong-together/shared`. Invalid input fails before service logic executes.

This matters for security because controllers do not trust TypeScript types at runtime. API contracts are checked at the edge, and tests reuse the shared response schemas to detect drift.

## Database-Level Security

The database contains domain schemas and row-level security policies. Authenticated requests are wrapped by `RlsTxInterceptor`, which calls `DBService.runWithRlsTx`.

For authenticated users, the transaction sets:

- `app.current_user_id`
- `SET LOCAL ROLE authenticated`

RLS policies then enforce ownership rules for:

- `identity.users`
- `identity.oauth_accounts`
- `workout.workoutplans`
- `workout.workoutsplits`
- `workout.exercisetoworkoutsplit`
- `tracking.workout_summary`
- `tracking.exercisetracking`
- `tracking.aerobictracking`
- `messages.messages`
- `reminders.user_reminder_settings`

The important architectural point: even if an application query forgets a `WHERE user_id = ...` condition, PostgreSQL still evaluates row ownership. That is the right shape for a backend that stores personal health and activity data.

## Failure And Observability Controls

`GlobalExceptionFilter` returns a consistent JSON error model:

```json
{
  "success": false,
  "message": "..."
}
```

It logs failures with method, path, status, request ID, and user context where available. Sentry is configured to avoid sending expected client errors below 500 and to drop bot-blocked transactions, reducing noise while keeping actionable server failures visible.
