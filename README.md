# Strong Together Backend (v1.11.0)

**Strong Together** is a fitness-oriented application.  
This repository contains the backend server that powers the app.  
It exposes a REST API for user registration and authentication, workout planning and tracking, messaging, exercises, and push notifications.

> **Security-first note:** The authentication layer uses **JWTs bound with DPoP (Demonstration of Proof-of-Possession)**. Tokens are cryptographically tied to a client-held key and validated per request with a DPoP proof. Details and client requirements appear below.

The backend is built with **Node.js** and **Express**, uses **PostgreSQL** as its main database, **Redis** for caching, **Socket.IO** for realtime events, **JWT** for authentication, **Zod** for schema validation, and integrates with **Supabase Storage** and the **Expo push notification service**.  
It also uses **Resend** for transactional email (account verification & password reset).

#### OAuth Providers & Account Linking (Google + Apple)

The backend supports **OAuth 2.0** sign-in with **Google** and **Apple** and automatically **links multiple providers** to a single internal user.

The application is containerized with **Docker** and currently deployed on **Render**.  
Previously, the project used **Supabase Client** directly from the frontend as a BaaS (Backend as a Service).  
Migrating to this dedicated backend improved performance, introduced server-side caching, and provided a more professional and maintainable architecture.

---

## Table of Contents

1. [Technologies & Architecture](#technologies--architecture)
2. [Project Structure](#project-structure)
3. [Middleware & Security](#middleware--security)
4. [Caching](#caching)
5. [Background Jobs & Queues](#background-jobs--queues)
6. [Running the Server](#running-the-server)
7. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [Users](#users)
   - [Exercises](#exercises)
   - [Messages](#messages)
   - [Workouts](#workouts)
   - [Analytics](#analytics)
   - [Bootstrap](#bootstrap)
   - [Aerobics](#aerobics)
   - [Push Notifications](#push-notifications)
8. [Database Models & Indexes](#database-models--indexes)
   - [Database Schema](#database-schema)
   - [Workout Flow](#workout-flow)
   - [Tracking Flow](#tracking-flow)
   - [Messages Flow](#messages-flow)
   - [Auth Flow](#auth-flow)
9. [WebSocket Events](#websocket-events)
10. [DPoP (Proof-of-Possession) Overview](#dpop-proof-of-possession-overview)
11. [Conclusion](#conclusion)

---

## Technologies & Architecture

| Layer/Service               | Purpose/Notes                                                                                                                                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js / Express 5**     | HTTP server and routing framework. Express 5 provides promise-aware request handlers.                                                                                                                                                                                 |
| **PostgreSQL**              | Primary relational database. SQL queries live in `src/queries`. The code relies on Postgres views (e.g. `v_exercisetracking_expanded`) to assemble workout plans and analytics.                                                                                       |
| **Redis**                   | Cache layer. When `CACHE_ENABLED=true`, workout plans and exercise tracking results are cached for 48h. **Payloads are GZIP-compressed** to reduce size and network time. Each user has a cache-version; on data changes the version increments to invalidate.        |
| **Socket.IO**               | WebSockets server used to emit `new_message` events when system or user messages arrive. Clients join a room named after their user ID to receive targeted events.                                                                                                    |
| **Supabase Storage**        | Used for storing user profile pictures. Files are uploaded and retrieved via signed service-role keys.                                                                                                                                                                |
| **Expo Push service**       | Sends push notifications to users’ devices. The server exposes a `/api/push/daily` endpoint that loops over tokens and calls Expo’s API.                                                                                                                              |
| **Resend (Email)**          | Transactional email for **account verification** and **password reset** flows.                                                                                                                                                                                        |
| **JWT + DPoP**              | Auth uses short-lived access tokens and longer-lived refresh tokens. Tokens are **DPoP-bound** (confirmation claim) and validated per request with a DPoP proof to prevent replay with a stolen token.                                                                |
| **Docker & Compose**        | Dockerfile produces Node 20 image, `docker-compose.yml` maps port 5000 to host.                                                                                                                                                                                       |
| **Render Deployment**       | The backend is deployed on Render for hosting and scaling.                                                                                                                                                                                                            |
| **BullMQ + Redis (Queues)** | Handles background jobs for push notifications and transactional emails. Each queue (e.g. `pushNotifications`, `email`) runs in a separate worker process. Producers enqueue jobs; workers consume and send through **Expo Push API** or **Resend API** respectively. |

---

## Project Structure

```
src/
├── config/        # Database, Redis, and Socket.IO configuration
├── controllers/   # Express route controllers (business logic)
├── middlewares/   # Custom middlewares (auth, validation, DPoP, rate-limiters, etc.)
├── queries/       # Parameterized SQL queries — each controller has its own queries file
├── queues/        # BullMQ producers and queue initializers (push & email)
│   ├── emails/
│   │   ├── emailsProducer.js
│   │   └── emailsQueue.js
│   └── pushNotifications/
│       ├── pushNotificationsProducer.js
│       └── pushNotificationsQueue.js
├── routes/        # Express route definitions
├── services/      # Domain-level services (storage, messaging, caching, etc.)
├── templates/     # Email HTML templates (Resend)
├── utils/         # General-purpose utilities (tokens, Redis helpers, sockets, etc.)
├── validators/    # Zod schemas for validating incoming requests
├── workers/       # Background workers consuming BullMQ queues
│   ├── utils/
│   │   └── setupGracefulShutdown.js
│   ├── emailsWorker.js
│   ├── pushNotificationsWorker.js
│   └── globalWorker.js
└── index.js       # Express server entry point


```

---

## Middleware & Security

| Middleware                          | Purpose                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **cors**                            | Configured for any origin with credentials.                                                             |
| **cookie-parser**                   | Parses cookies from incoming requests.                                                                  |
| **express.json**                    | Parses JSON bodies.                                                                                     |
| **helmet**                          | Adds security headers.                                                                                  |
| **generalLimiter**                  | Rate-limits (100 req/min/IP).                                                                           |
| **botBlocker**                      | Blocks malicious bots and scanners.                                                                     |
| **checkAppVersion**                 | Enforces minimum app version via `MIN_APP_VERSION`.                                                     |
| **dpopValidationMiddleware**        | Verifies DPoP proof: signature, `typ`, `htm`, strict origin+path validation, and a short `iat` window.  |
| **asyncHandler**                    | Wraps handlers, forwards errors.                                                                        |
| **authMiddleware (protect)**        | Verifies JWT, checks `tokenVersion`, and **matches the token’s DPoP confirmation** with the live proof. |
| **roleMiddleware (authorizeRoles)** | Restricts routes by roles (e.g. admin, currently unused).                                               |
| **withRlsTx**                       | Manages RLS + transaction per request (sets role/claims, wraps multi-query ops atomically).             |
| **validateRequest**                 | Validates `req.body` with Zod schemas.                                                                  |
| **uploadImage**                     | Handles multipart uploads (images ≤10 MB, only JPEG/JPG/PNG/WebP).                                      |
| **errorHandler**                    | Central error handler with JSON responses.                                                              |

**Other Security Measures:**

- **Atomic CAS Refresh:** `POST /auth/refresh` validates current `tokenVersion`, issues new tokens, and increments the version atomically.
- **Short-lived access tokens** and **longer-lived refresh tokens**.
- **Single-device sessions via `tokenVersion`.**
- **Bot/Scanner blocker** and **rate limiting** on public endpoints.
- **Password hashing** with bcrypt (10 salt rounds).
- **Strict input validation** (Zod).
- **CORS** configured with credentials; proxy trust is enabled to capture the real client IP.

---

## Caching

- **Compression:** cache payloads are **GZIP-compressed** before writing to Redis and decompressed on read.
- Controlled by `CACHE_ENABLED`.
- Workout plan (`/api/workouts/getworkout`) and exercise analytics (`/api/workouts/gettracking`) are cached under `{namespace}:{userId}:v{n}` where `v{n}` is the user’s cache-version.
- TTLs:
  - Plan cache: 48h (configurable via `CACHE_TTL_PLAN_SEC`)
  - Tracking cache: 48h (configurable via `CACHE_TTL_TRACKING_SEC`)
- `X-Cache` response header exposes `HIT` / `MISS`.

---

## Background Jobs & Queues

The backend uses **Redis** and **BullMQ** to manage background job processing for notifications and emails.

### Queues (Producers)

| Queue               | Purpose                                                                              | Producer Path                                               |
| ------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `pushNotifications` | Enqueues push notification jobs to be sent via the **Expo Push API**.                | `src/queues/pushNotifications/pushNotificationsProducer.js` |
| `emails`            | Enqueues transactional email jobs (verification, password reset) via **Resend API**. | `src/queues/emails/emailsProducer.js`                       |

Each producer encapsulates the logic of creating a job and adding it to the corresponding BullMQ queue instance.

### Workers (Consumers)

| Worker                    | Purpose                                                              | Worker Path                                  |
| ------------------------- | -------------------------------------------------------------------- | -------------------------------------------- |
| `pushNotificationsWorker` | Processes push jobs and delivers messages to Expo Push service.      | `src/workers/pushNotificationsWorker.js`     |
| `emailsWorker`            | Processes email jobs using the **Resend API**.                       | `src/workers/emailsWorker.js`                |
| `globalWorker`            | Initializes all queues together (for local or container deployment). | `src/workers/globalWorker.js`                |
| `setupGracefulShutdown`   | Handles safe shutdown for workers to close connections cleanly.      | `src/workers/utils/setupGracefulShutdown.js` |

### Flow

1. **Producer enqueue:** Controllers or cron jobs call the producer (e.g. `enqueuePushNotifications()` or `enqueueEmails()`).
2. **Queue:** BullMQ pushes the job into Redis.
3. **Worker consume:** Worker scripts listen to the queues and process jobs concurrently.
4. **Retries & logging:** Failed jobs are retried automatically with exponential backoff and logged.

## Running the Server

1. Create `.env` with:

```env
PORT=...
DATABASE_URL=postgres://...
REDIS_HOST=...
REDIS_PORT=...
REDIS_USERNAME=...
REDIS_PASSWORD=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE=...
BUCKET_NAME=...
SYSTEM_USER_ID=...
CACHE_ENABLED=true
CACHE_TTL_TRACKING_SEC=...
CACHE_TTL_PLAN_SEC=...
MIN_APP_VERSION=...

# DPoP settings
DPOP_ENABLED=true
PUBLIC_BASE_URL=https://<prod-host>
PUBLIC_BASE_URL_RENDER_DEFAULT=https://<render-host>
PRIVATE_BASE_URL_DEV=http://localhost:5000
```

2. Install dependencies:

```bash
npm install
node src/index.js
```

3. Or run with Docker:

```bash
docker compose up --build
```

---

## API Endpoints Documentation

Base path: `/api`  
Health: `/health` returns server status.

> **Timezone note (`tz`)**: several endpoints accept a `tz` query parameter (IANA zone string, e.g., `Asia/Jerusalem`) to compute day boundaries server-side.

## Auth headers (protected routes)

```http
Authorization: DPoP <accessToken>
DPoP: <compact-JWS-proof>
```

**Login / OAuth login with DPoP binding (when `DPOP_ENABLED=true`):**

```http
DPoP-Key-Binding: <public-key-thumbprint>
```

> Note: Older app versions `4.1.0` / `4.1.1` may have partial relaxations. From `4.3.0` onward, full DPoP is enforced.

---

## Authentication

| Method | Endpoint                      | Auth? | Body / Query / Headers                                                     | Description                                                                                                                             |
| ------ | ----------------------------- | :---: | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/login`                 |  No   | Body: `{ identifier, password }` • Header: `DPoP-Key-Binding` (if DPoP on) | Username/Email + password. Bumps `tokenVersion`. Returns `{ accessToken, refreshToken, user }`. First-login triggers a welcome message. |
| POST   | `/auth/refresh`               |  No   | Header: `x-refresh-token` • Headers: `DPoP` (proof), app-version checks    | Sliding refresh; validates DPoP key-binding vs token `cnf.jkt`. Returns fresh `{ accessToken, refreshToken, userId }`.                  |
| POST   | `/auth/logout`                |  No   | Body/Header: refresh token                                                 | Clears push token, bumps `tokenVersion`.                                                                                                |
| GET    | `/auth/verify`                |  No   | Query: `?token=...`                                                        | Email verification link → **HTML** success/fail. Single-use JTI allow-list.                                                             |
| POST   | `/auth/sendverificationemail` |  No   | Body: `{ email }`                                                          | Sends verification email. `204` on success (even if user not found).                                                                    |
| PUT    | `/auth/changeemailverify`     |  No   | Body: `{ username, password, newEmail }`                                   | For **unverified** users only: change email then resend verify link.                                                                    |
| GET    | `/auth/checkuserverify`       |  No   | Query: `?username=...`                                                     | Returns `{ isVerified: boolean }`.                                                                                                      |
| POST   | `/auth/forgotpassemail`       |  No   | Body: `{ identifier }`                                                     | Sends forgot-password email (if `auth_provider='app'`). `204` on success.                                                               |
| PUT    | `/auth/resetpassword`         |  No   | Query: `?token=...` • Body: `{ newPassword }`                              | Resets password via emailed token; single-use JTI; bumps `tokenVersion`.                                                                |

---

## OAuth Providers & Account Linking (Google + Apple)

| Method | Endpoint             | Auth? | Body / Headers                                                                 | Description                                                                                                                                                                                                                       |
| ------ | -------------------- | :---: | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/oauth/google`      |  No   | Headers: `DPoP-Key-Binding` (required if DPoP on) • Body: `{ idToken }`        | Verifies Google ID token, **links or creates** user via `oauth_accounts`. If profile is incomplete, returns `missingFields` and **no refresh token**.<br>Response: `{ user, accessToken, refreshToken \| null, missingFields? }`. |
| POST   | `/oauth/apple`       |  No   | Headers: `DPoP-Key-Binding` • Body: `{ idToken, rawNonce, fullName?, email? }` | Verifies Apple identity token (+nonce), **links or creates** user like Google. Supports first-sign-in name propagation.<br>Response: `{ user, accessToken, refreshToken \| null, missingFields? }`.                               |
| POST   | `/oauth/proceedauth` |  Yes  | Headers: `Authorization: DPoP <accessToken>`, `DPoP`                           | Call **after** completing required fields. If `oauth_accounts.missing_fields` is clear → bumps `tokenVersion` and returns **full session** `{ accessToken, refreshToken }`. If still missing → `409`.                             |

**Linking behavior (server-side):**

- Lookup by provider `sub`; else try **email-verified** linking to existing `users.email` (case-insensitive).
- On success insert (idempotent) into `oauth_accounts(provider, provider_user_id)`.
- Multiple providers with the same email **merge** into one user profile.
- `oauth_accounts.missing_fields` guides the client to complete `email` / `name` when provider data is insufficient.

---

## Users

| Method | Endpoint                  | Auth? | Body / Query                                                                                         | Description                                                                                                                                 |
| ------ | ------------------------- | :---: | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/users/create`           |  No   | `{ username, fullName, email, password, gender }`                                                    | Creates user (credentials flow only), sends verification email.                                                                             |
| GET    | `/users/get`              |  Yes  | —                                                                                                    | Returns authenticated user aggregate JSON.                                                                                                  |
| PUT    | `/users/updateself`       |  Yes  | Any of: `username, fullName, email, gender, password, profileImgUrl, pushToken, setCompletedOnOAuth` | Updates profile. Email change triggers **confirm-by-link** email. When `setCompletedOnOAuth=true` → clears `oauth_accounts.missing_fields`. |
| PUT    | `/users/changeemail`      |  No   | Query: `?token=...` (link in email)                                                                  | Confirms **email change** via link (HTML 200). Single-use JTI; 409 if email taken.                                                          |
| DELETE | `/users/deleteself`       |  Yes  | —                                                                                                    | Deletes own account.                                                                                                                        |
| PUT    | `/users/pushtoken`        |  Yes  | `{ token }`                                                                                          | Saves Expo push token. `204`.                                                                                                               |
| PUT    | `/users/setprofilepic`    |  Yes  | `multipart/form-data` with `file`                                                                    | Uploads to Supabase Storage and updates user picture. Returns `{ path, url }`.                                                              |
| DELETE | `/users/deleteprofilepic` |  Yes  | Body: `{ path }`                                                                                     | Deletes picture from bucket & clears on user.                                                                                               |

---

## Exercises

| Method | Endpoint            | Auth? | Description            |
| ------ | ------------------- | :---: | ---------------------- |
| GET    | `/exercises/getall` |  Yes  | Returns all exercises. |

---

## Messages

| Method | Endpoint                    | Auth? | Params / Body   | Description             |
| ------ | --------------------------- | :---: | --------------- | ----------------------- |
| GET    | `/messages/getmessages`     |  Yes  | Optional `?tz=` | Inbox with sender pics. |
| PUT    | `/messages/markmasread/:id` |  Yes  | URL `id`        | Mark message as read.   |
| DELETE | `/messages/delete/:id`      |  Yes  | URL `id`        | Delete message.         |

---

## Workouts

| Method | Endpoint                  | Auth? | Body / Query                        | Description                                                             |
| ------ | ------------------------- | :---: | ----------------------------------- | ----------------------------------------------------------------------- |
| GET    | `/workouts/getworkout`    |  Yes  | Optional `?tz=`                     | Active workout plan (Redis-cached).                                     |
| GET    | `/workouts/gettracking`   |  Yes  | Optional `?tz=`                     | 45-day analytics (Redis-cached).                                        |
| POST   | `/workouts/finishworkout` |  Yes  | `{ workout: Array, tz }`            | Persists completed workout, warms tracking cache, sends system message. |
| POST   | `/workouts/add`           |  Yes  | `{ workoutData, workoutName?, tz }` | Create new plan; invalidates + warm-caches plan & analytics.            |
| DELETE | `/workouts/delete`        |  Yes  | —                                   | **Temporarily disabled**.                                               |

---

## Analytics

| Method | Endpoint         | Auth? | Description                       |
| ------ | ---------------- | :---: | --------------------------------- |
| GET    | `/analytics/get` |  Yes  | `{ _1RM, goals }` (Redis-cached). |

---

## Bootstrap

| Method | Endpoint         | Auth? | Query / Body    | Description                                                                  |
| ------ | ---------------- | :---: | --------------- | ---------------------------------------------------------------------------- |
| POST   | `/bootstrap/get` |  Yes  | Optional `?tz=` | Bundled payload: `{ user, workout, tracking, aerobics, messages }` (45-day). |

---

## Aerobics

| Method | Endpoint        | Auth? | Body / Query     | Description                                     |
| ------ | --------------- | :---: | ---------------- | ----------------------------------------------- |
| GET    | `/aerobics/get` |  Yes  | Optional `?tz=`  | Aerobic sessions map for the last 45 days.      |
| POST   | `/aerobics/add` |  Yes  | `{ record, tz }` | Adds a record and returns refreshed 45-day map. |

---

## Push Notifications

| Method | Endpoint      | Auth? | Description                           |
| ------ | ------------- | :---: | ------------------------------------- |
| GET    | `/push/daily` |  No   | Test endpoint that sends a demo push. |

---

## Data model (OAuth)

**Table: `oauth_accounts`**  
Fields: `user_id`, `provider` (`google` / `apple`), `provider_user_id`, `provider_email`, `missing_fields`

- Unique constraint: (`provider`, `provider_user_id`)
- Foreign key: `user_id → users.id`
- Used for **linking or merging** multiple OAuth identities under a single app user.

## Database Models & Indexes

- Uses **Postgres** with parameterised queries.
- Views: `v_exercisetoworkoutsplit_expanded`, `v_exercisetracking_expanded`.
- Unique constraints on `username` and `email`.
- Column **`users.tokenVersion`** (int, default 0) – embedded into JWTs to enforce single-device sessions and to kill stale tokens on demand.
- **UPSERT-friendly uniqueness** for workout structures:
  - `workoutplans`: a single active plan per user (e.g., partial unique index on `(user_id)` where `is_active = TRUE`).
  - `workoutsplits`: unique per plan on `(workout_id, name)` to allow idempotent updates.
  - `exercisetoworkoutsplit`: unique per split on `(workoutsplit_id, exercise_id)` (plus `order_index` as data) to enable upserts.
- Table **`aerobictracking`** – logs aerobic/cardio sessions (e.g., `type`, `duration_mins`, `duration_sec`, `workout_date`) per user for non-strength activities.
- Soft-deletes / toggling: `is_active` is used on splits and ETS rows to deactivate removed items during plan updates.

### Row Level Security (RLS) & Transaction Management

The backend implements a robust server-side **Row Level Security (RLS)** layer to ensure data ownership and integrity.

1. **RLS Middleware (`withRlsTx`):** For every authenticated request, it opens a **transaction**, sets role to `authenticated`, and injects user claims into the session so policies enforce `auth.uid()` correctly across all queries.
2. **Policies:** Top-level tables enforce direct ownership (`user_id = auth.uid()`); nested tables verify ownership via joins to the parent entities.
3. **Atomicity:** Domain operations run inside the wrapping transaction to guarantee all-or-nothing behavior (e.g., plan updates).
4. **Public endpoints:** Skip RLS but use explicit transactions when multi-query integrity matters.

---

## Database Schema

The backend uses PostgreSQL as its primary datastore. The schema
defines tables for users, messages, workout plans, splits, exercises
and tracking logs, **including aerobic sessions via `aerobictracking`**.

### Workout Flow

![Database workout flow](https://github.com/user-attachments/assets/7a634d62-9c30-4546-b24e-46df64781a6a)

1. **Create or Update Plan (UPSERT)** – One active `WorkoutPlan` per user. Updating a plan keeps the same plan row and bumps metadata (name, number of splits).
2. **UPSERT Splits** – Incoming split keys are upserted by `(workout_id, name)`. Splits not present in the payload are set `is_active = FALSE`.
3. **UPSERT Exercises per Split** – Each `(workoutsplit_id, exercise_id)` is upserted with the latest `sets` and `order_index`. Missing exercises are set `is_active = FALSE`.
4. **Cache invalidation** – After a successful update, the user’s cache-version increments so clients fetch fresh data.

### Tracking Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/21dba52e-1cb9-459c-a2f6-2b4e9a3e9588)

1. **Select a split** – User opens a split.
2. **Record Sets** – Weight/repetitions logged into `exercisetracking`.
3. **Review Progress** – Data aggregated for analytics.
4. **Aerobic tracking** – Cardio sessions stored in `aerobictracking` and included in progress views.

### Messages Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/9a87b874-be46-403e-bfbc-c3709175767f)

1. **Compose Message** – System inserts message.
2. **Receive & Read** – Users fetch inbox, mark read.
3. **Delete** – Delete request marks record as deleted.

### Auth Flow

![Database authentication flow](https://github.com/user-attachments/assets/eb0c0c2a-84bc-4409-9b7a-b7019c1ebd27)

1. **Login & Token Issuance** – Access + refresh tokens created; when DPoP is enabled, tokens include a confirmation claim bound to the client key.
2. **Access Control** – All protected API requests require access token + DPoP proof.
3. **Token Refresh** – Refresh rotates both tokens; the request must include a valid DPoP proof whose key material matches the token’s confirmation.

---

## WebSocket Events

- Clients connect via `/socket.io`.
- Emit `user_loggedin` with ID → join room.
- New messages broadcast `new_message` to user’s room.

---

## DPoP (Proof-of-Possession) Overview

**Goal:** Bind JWTs to a client-held asymmetric key so that a stolen token alone is **not enough** to call the API.

- **Key:** Client keeps an **EC P‑256** key pair (ES256).
- **Binding at login:** Client sends a public-key thumbprint (`DPoP-Key-Binding`). The server embeds it as a confirmation claim in both tokens.
- **Per-request proof:** For protected routes (and for `/auth/refresh`), client sends a **DPoP** proof (compact JWS) in the `DPoP` header. The proof includes the HTTP method, absolute URL, issued-at, and the public JWK for verification.
- **Server checks:** Signature and header type; method and path equality; strict origin/path validation against server configuration; and a **short** issued-at window. The server derives the key thumbprint from the proof and matches it to the token’s confirmation.
- **JTI blacklisting:** Validates with **Redis cache** to check if JTI was already in use, to prevent **replay-attacks.**

### How DPoP Works Here

1. Client generates and stores a P‑256 key pair.
2. **Login** → send credentials + `DPoP-Key-Binding` (public key thumbprint). Server issues DPoP-bound tokens.
3. **Protected requests** → send `Authorization: DPoP <accessToken>` and `DPoP: <proof>`.
4. Middleware validates the proof, confirms it matches the token, and authorizes the request.

### Required Headers From Client

```
# Protected routes
Authorization: DPoP <accessToken>
DPoP: <compact-JWS-proof>

# Login only
DPoP-Key-Binding: <public-key-thumbprint>
```

### Environment Variables

- `DPOP_ENABLED=true|false`
- `PUBLIC_BASE_URL`
- `PUBLIC_BASE_URL_RENDER_DEFAULT`
- `PRIVATE_BASE_URL_DEV`

> The server validates DPoP `htu` against its configured origins and enforces exact path matching.

---

## Conclusion

The backend provides a secure, modular API for the **Strong Together** fitness app.  
Built with **Node.js**, **Postgres**, **Redis**, **JWT (DPoP-bound)**, and **Socket.IO**.  
Security: short-lived access tokens, atomic refresh rotation, DPoP proof-of-possession, bcrypt, rate limiting, CORS, and Zod validation.  
Performance: Redis caching with GZIP.  
Deployment: Containerized with Docker, hosted on Render.  
Extensible and production-ready.
