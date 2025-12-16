# Strong Together Backend (v2.2.0)

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
   1. [Authentication](#authentication)
   2. [Users](#users)
   3. [OAuth](#oauth)
   4. [Workouts](#workouts)
   5. [Messages](#messages)
   6. [Exercises](#exercises)
   7. [Analytics](#analytics)
   8. [Bootstrap](#bootstrap)
   9. [Aerobics](#aerobics)
   10. [Push Notifications](#push-notifications)
   11. [WebSocket](#websocket)
8. [Database Models & Indexes](#database-models--indexes)
   1. [Database Schema](#database-schema)
   2. [Workout Flow](#workout-flow)
   3. [Tracking Flow](#tracking-flow)
   4. [Messages Flow](#messages-flow)
   5. [Auth Flow](#auth-flow)
   6. [Reminder Flow](#reminder-flow-new)
9. [WebSocket Events](#websocket-events)
   1. [Connection Flow](#connection-flow)
   2. [Security Highlights](#security-highlights)
10. [DPoP (Proof-of-Possession) Overview](#dpop-proof-of-possession-overview)
    1. [How DPoP Works Here](#how-dpop-works-here)
    2. [Required Headers From Client](#required-headers-from-client)
    3. [Environment Variables](#environment-variables)
11. [Conclusion](#conclusion)

---

## Technologies & Architecture

| Layer/Service               | Purpose/Notes                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js / Express 5**     | HTTP server and routing framework. Express 5 provides promise-aware request handlers.                                                                                                                                                                                                                                                                                                               |
| **PostgreSQL**              | Primary relational database. SQL queries live in `src/queries`. The code relies on Postgres views (e.g. `v_exercisetracking_expanded`) to assemble workout plans and analytics.                                                                                                                                                                                                                     |
| **Redis**                   | Cache layer. When `CACHE_ENABLED=true`, workout plans and exercise tracking results are cached for 48h. **Payloads are GZIP-compressed** to reduce size and network time. Each user has a cache-version; on data changes the version increments to invalidate.                                                                                                                                      |
| **Socket.IO**               | Secure WebSocket layer for realtime events (messages, notifications). Each client must first request a short-lived **connection ticket** (`/api/ws/generateticket`) before connecting. The server validates the ticket (JWT signed with `JWT_SOCKET_SECRET`) during the handshake, assigns the socket to the user’s private room, and handles automatic reconnects with ticket refresh when needed. |
| **Supabase Storage**        | Used for storing user profile pictures. Files are uploaded and retrieved via signed service-role keys.                                                                                                                                                                                                                                                                                              |
| **Expo Push service**       | Sends push notifications to users’ devices. The server exposes a `/api/push/daily` endpoint that loops over tokens and calls Expo’s API.                                                                                                                                                                                                                                                            |
| **Resend (Email)**          | Transactional email for **account verification** and **password reset** flows.                                                                                                                                                                                                                                                                                                                      |
| **JWT + DPoP**              | Auth uses short-lived access tokens and longer-lived refresh tokens. Tokens are **DPoP-bound** (confirmation claim) and validated per request with a DPoP proof to prevent replay with a stolen token.                                                                                                                                                                                              |
| **Docker & Compose**        | Dockerfile produces Node 20 image, `docker-compose.yml` maps port 5000 to host.                                                                                                                                                                                                                                                                                                                     |
| **Render Deployment**       | The backend is deployed on Render for hosting and scaling.                                                                                                                                                                                                                                                                                                                                          |
| **BullMQ + Redis (Queues)** | Handles background jobs for push notifications and transactional emails. Each queue (e.g. `pushNotifications`, `email`) runs in a separate worker process. Producers enqueue jobs; workers consume and send through **Expo Push API** or **Resend API** respectively.                                                                                                                               |
| **Workout summary layer**   | New layer used to normalize per-workout metadata (`workout_start_utc`, `workout_end_utc`) and link it to `exercisetracking`. This is now the **authoritative source** for workout boundaries.                                                                                                                                                                                                       |
| **Reminder subsystem**      | New subsystem based on `user_split_information` + `user_reminder_settings` tables. A daily DB cron recomputes preferred weekday + estimated hour per split, and an hourly server cron turns these into Expo pushes.                                                                                                                                                                                 |

---

## Project Structure

```text
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

---

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

### Authentication

| Method | Endpoint                          | Auth? | DPoP?           | Body / Query / Headers                                         | Description                                                       |
| ------ | --------------------------------- | :---: | --------------- | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| GET    | `/`                               |  No   | No              | —                                                              | Server is running ping.                                           |
| GET    | `/health`                         |  No   | No              | —                                                              | Health check returns `{ status: "ok" }`.                          |
| POST   | `/api/auth/login`                 |  No   | If DPoP enabled | Body: `{ identifier, password }` • Headers: `DPoP-Key-Binding` | Logs in a user; returns access/refresh tokens and user id.        |
| POST   | `/api/auth/refresh`               |  No   | **Yes**         | Headers: `DPoP`, `x-refresh-token` (DPoP or Bearer)            | Rotates and returns new access/refresh tokens.                    |
| GET    | `/api/auth/verify`                |  No   | No              | Query: `?token=...`                                            | Verifies account via email link; returns HTML.                    |
| POST   | `/api/auth/sendverificationemail` |  No   | No              | Body: `{ email }`                                              | Sends verification email (`204` if email not found).              |
| PUT    | `/api/auth/changeemailverify`     |  No   | No              | Body: `{ username, password, newEmail }`                       | Authenticates and sends email-change verification link.           |
| GET    | `/api/auth/checkuserverify`       |  No   | No              | Query: `?username=...`                                         | Returns `{ isVerified }`.                                         |
| POST   | `/api/auth/forgotpassemail`       |  No   | No              | Body: `{ identifier }`                                         | Sends password reset email if account exists (`204` on no-match). |
| PUT    | `/api/auth/resetpassword`         |  No   | No              | Query: `?token=...` • Body: `{ newPassword }`                  | Resets password via emailed token.                                |
| POST   | `/api/auth/logout`                |  Yes  | **Yes**         | Headers: `Authorization`, `DPoP`, `x-refresh-token`            | Logs out and bumps token version; clears push token.              |

### Users

| Method | Endpoint                      | Auth? | DPoP? | Body / Query / Headers                                                                                | Description                                               |
| ------ | ----------------------------- | :---: | :---: | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| POST   | `/api/users/create`           |  No   |  No   | Body: `{ username, fullName, email, password, gender }`                                               | Registers a new user; sends verification email.           |
| GET    | `/api/users/get`              |  Yes  |  Yes  | Headers: `Authorization`, `DPoP`                                                                      | Returns authenticated user profile.                       |
| PUT    | `/api/users/update`           |  Yes  |  Yes  | Body: partial `{ username, fullName, email, setCompletedOnOAuth }` • Headers: `Authorization`, `DPoP` | Updates user; if email changed, sends confirmation email. |
| PUT    | `/api/users/updateself`       |  Yes  |  Yes  | Body: same as `/update` • Headers: `Authorization`, `DPoP`                                            | Alias of update; validates and updates user.              |
| PUT    | `/api/users/pushtoken`        |  Yes  |  Yes  | Body: `{ token }` • Headers: `Authorization`, `DPoP`                                                  | Saves Expo push token.                                    |
| PUT    | `/api/users/setprofilepic`    |  Yes  |  Yes  | Headers: `Authorization`, `DPoP`, `Content-Type: multipart/form-data` • Body: file field `"file"`     | Uploads profile image and updates profile image URL.      |
| DELETE | `/api/users/deleteprofilepic` |  Yes  |  Yes  | Body: `{ path }` • Headers: `Authorization`, `DPoP`                                                   | Deletes current profile image and clears URL.             |
| DELETE | `/api/users/deleteself`       |  Yes  |  Yes  | Headers: `Authorization`, `DPoP`                                                                      | Deletes the authenticated user.                           |
| GET    | `/api/users/changeemail`      |  No   |  No   | Query: `?token=...`                                                                                   | Confirms email change via link; returns HTML.             |

### OAuth

| Method | Endpoint                 | Auth? | DPoP?           | Body / Headers                                                             | Description                                                        |
| ------ | ------------------------ | :---: | --------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| POST   | `/api/oauth/google`      |  No   | If DPoP enabled | Headers: `DPoP-Key-Binding` • Body: `{ idToken }`                          | Google sign-in/up; may link or create; returns tokens and user id. |
| POST   | `/api/oauth/apple`       |  No   | If DPoP enabled | Headers: `DPoP-Key-Binding` • Body: `{ idToken, rawNonce, name?, email? }` | Apple sign-in/up; may link or create; returns tokens and user id.  |
| POST   | `/api/oauth/proceedauth` |  Yes  | **Yes**         | Headers: `Authorization`, `DPoP`                                           | Completes OAuth profile and re-issues tokens.                      |

### Workouts

| Method | Endpoint                      | Auth? | DPoP? | Body / Query / Headers                                                                                                     | Description                                           |
| ------ | ----------------------------- | :---: | :---: | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| GET    | `/api/workouts/getworkout`    |  Yes  |  Yes  | Query: `?tz=` • Headers: `Authorization`, `DPoP`                                                                           | Returns full workout plan and splits.                 |
| GET    | `/api/workouts/gettracking`   |  Yes  |  Yes  | Query: `?tz=` • Headers: `Authorization`, `DPoP`                                                                           | Returns 45-day tracking and stats.                    |
| POST   | `/api/workouts/finishworkout` |  Yes  |  Yes  | Body: `{ workout: array, tz?, workout_start_utc?, workout_end_utc? }` • Headers: `Authorization`, `DPoP`, `X-App-Version?` | Saves finished workout and refreshes tracking cache.  |
| DELETE | `/api/workouts/delete`        |  Yes  |  Yes  | Headers: `Authorization`, `DPoP`                                                                                           | Reserved delete endpoint (no current implementation). |
| POST   | `/api/workouts/add`           |  Yes  |  Yes  | Body: `{ workoutData, workoutName, tz }` • Headers: `Authorization`, `DPoP`                                                | Creates a workout and refreshes caches.               |

### Messages

| Method | Endpoint                       | Auth? | DPoP? | Body / Query / Headers                           | Description              |
| ------ | ------------------------------ | :---: | :---: | ------------------------------------------------ | ------------------------ |
| GET    | `/api/messages/getmessages`    |  Yes  |  Yes  | Query: `?tz=` • Headers: `Authorization`, `DPoP` | Lists user messages.     |
| PUT    | `/api/messages/markasread/:id` |  Yes  |  Yes  | Path: `:id` • Headers: `Authorization`, `DPoP`   | Marks a message as read. |
| DELETE | `/api/messages/delete/:id`     |  Yes  |  Yes  | Path: `:id` • Headers: `Authorization`, `DPoP`   | Deletes a message.       |

### Exercises

| Method | Endpoint                | Auth? | DPoP? | Body / Headers                   | Description                             |
| ------ | ----------------------- | :---: | :---: | -------------------------------- | --------------------------------------- |
| GET    | `/api/exercises/getall` |  Yes  |  Yes  | Headers: `Authorization`, `DPoP` | Returns all exercises mapped by muscle. |

### Analytics

| Method | Endpoint             | Auth? | DPoP? | Body / Headers                   | Description                                |
| ------ | -------------------- | :---: | :---: | -------------------------------- | ------------------------------------------ |
| GET    | `/api/analytics/get` |  Yes  |  Yes  | Headers: `Authorization`, `DPoP` | Returns analytics: 1RM and goal adherence. |

### Bootstrap

| Method | Endpoint             | Auth? | DPoP? | Body / Query / Headers                           | Description                                                          |
| ------ | -------------------- | :---: | :---: | ------------------------------------------------ | -------------------------------------------------------------------- |
| GET    | `/api/bootstrap/get` |  Yes  |  Yes  | Query: `?tz=` • Headers: `Authorization`, `DPoP` | Bundled bootstrap payload: user, plan, tracking, aerobics, messages. |

### Aerobics

| Method | Endpoint            | Auth? | DPoP? | Body / Query / Headers                                                                         | Description                                            |
| ------ | ------------------- | :---: | :---: | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| GET    | `/api/aerobics/get` |  Yes  |  Yes  | Query: `?tz=` • Headers: `Authorization`, `DPoP`                                               | Returns aerobics data (daily/weekly) for last 45 days. |
| POST   | `/api/aerobics/add` |  Yes  |  Yes  | Body: `{ record: { type, durationMins, durationSec }, tz }` • Headers: `Authorization`, `DPoP` | Adds an aerobic record and returns updated view.       |

### Push Notifications

| Method | Endpoint                   | Auth? | DPoP? | Body / Headers | Description                                               |
| ------ | -------------------------- | :---: | :---: | -------------- | --------------------------------------------------------- |
| GET    | `/api/push/daily`          |  No   |  No   | —              | Enqueues daily push notifications for all opt-in users.   |
| GET    | `/api/push/hourlyreminder` |  No   |  No   | —              | Enqueues hourly reminder pushes based on user stats/time. |

### WebSocket

| Method | Endpoint                 | Auth? | DPoP? | Body / Headers                                           | Description                            |
| ------ | ------------------------ | :---: | :---: | -------------------------------------------------------- | -------------------------------------- |
| POST   | `/api/ws/generateticket` |  Yes  |  Yes  | Body: `{ username? }` • Headers: `Authorization`, `DPoP` | Issues a short-lived WebSocket ticket. |

**New reminder feature – how it works (DB cron + server cron):**

1. **Daily DB cron (inside Postgres):** calls `public.refresh_user_split_information()` (see SQL in `db/functions`), which:
   - looks at the last **21 days** of workouts **per user + per split** based on `exercisetracking` **and** the new `workout_summary` table,
   - picks the **most common weekday** for that split,
   - calculates the **average start time** of the workout in **UTC**,
   - writes/upserts into `public.user_split_information (user_id, split_id, estimated_time_utc, confidence, preferred_weekday)` with a confidence score.
2. **Daily server cron (outside service):** calls `/api/push/hourlyreminder` which:
   - fetches all users whose `user_reminder_settings.workout_reminders_enabled = TRUE`,
   - joins them with `user_split_information` (only rows with `confidence >= 0.60` and `preferred_weekday = today`),
   - loads the **actual split name** from `workoutsplits`,
   - for each user, uses `computeDelayFromUTC(now, estimated_time_utc, reminder_offset_minutes)` to compute when **today** we should send the push,
   - enqueues all pushes to the `pushNotifications` BullMQ queue with the right **delay in ms**.
3. **Expo push worker:** sends the pushes at the exact time.
4. **Client side:** just saves the Expo token (`/users/pushtoken`) and the user’s reminder settings. No extra logic is required on the device.

This gives you **stable** and **timezone-safe** reminders based on real historic workouts, not on guesses.

---

## Database Models & Indexes

- Uses **Postgres** with parameterised queries.
- Views: `v_exercisetoworkoutsplit_expanded`, `v_exercisetracking_expanded`, `v_exercisetracking_set_simple`, `v_prs` – **all of these join `exercise_tracking` → `workout_summary` and re-expose `user_id` and the workout timestamps.** The physical table `exercise_tracking` no longer stores `user_id` or `workout_time_utc`; the summary is the source of truth.
- Unique constraints on `username` and `email`.
- Column **`users.tokenVersion`** (int, default 0) – embedded into JWTs to enforce single-device sessions and to kill stale tokens on demand.
- **UPSERT-friendly uniqueness** for workout structures:
  - `workoutplans`: a single active plan per user (e.g., partial unique index on `(user_id)` where `is_active = TRUE`). fileciteturn0file0L348-L361
  - `workoutsplits`: unique per plan on `(workout_id, name)` to allow idempotent updates. fileciteturn0file0L367-L376
  - `exercisetoworkoutsplit`: unique per split on `(workoutsplit_id, exercise_id)` (plus `order_index` as data) to enable upserts. fileciteturn0file0L334-L346
- **Table `workout_summary`** – normalized table to capture per-workout start/end and link all `exercise_tracking` rows for that workout. This makes the summary the single source of truth for timestamps.
- Table **`user_split_information`** – **new** table filled by the daily DB cron to store per-user+split preferred weekday and **estimated_time_utc** plus a confidence level. Primary key is `(id)` with a **unique** constraint on `(user_id, split_id)`. fileciteturn0file0L179-L208
- Table **`user_reminder_settings`** – **new** table on the user that controls whether reminders are enabled and how many minutes before to remind. Defaults: `workout_reminders_enabled = true`, `reminder_offset_minutes = 60`. fileciteturn0file0L165-L178
- Table **`aerobictracking`** – logs aerobic/cardio sessions.
- Soft-deletes / toggling: `is_active` is used on splits and ETS rows to deactivate removed items during plan updates.
- **Housekeeping function** `public.housekeeping_compact_old_workouts()` now relies on **`workout_summary` dates** instead of raw `exercisetracking.workout_time_utc`, so old workouts are deleted per **workout-day** and not per single set. fileciteturn0file0L25-L70

### Database Schema

The backend uses PostgreSQL as its primary datastore. The schema
defines tables for users, messages, workout plans, splits, exercises
and tracking logs, **including aerobic sessions via `aerobictracking`** and now **workout summaries** for better time analytics. fileciteturn0file0L260-L329

---

### Workout Flow

> 🖼 **DB Workout Flow diagram**

![Database workout flow](https://github.com/user-attachments/assets/7a634d62-9c30-4546-b24e-46df64781a6a)

1. **Create or Update Plan (UPSERT)** – One active `workoutplans` row per user. Updating a plan keeps the same plan row and bumps metadata (name, number of splits).
2. **UPSERT Splits** – Incoming split keys are upserted by `(workout_id, name)`. Splits not present in the payload are set `is_active = FALSE`.
3. **UPSERT Exercises per Split** – Each `(workoutsplit_id, exercise_id)` is upserted with the latest `sets` and `order_index`. Missing exercises are set `is_active = FALSE`.
4. **Cache invalidation** – After a successful update, the user’s cache-version increments so clients fetch fresh data.

---

### Tracking Flow

> 🖼 **DB Tracking Flow diagram**

![Database workout tracking flow – with workout_summary](https://github.com/user-attachments/assets/be800fc7-5411-40f5-9740-2395af151f08)

1. **Start / Finish workout** – App calls `/workouts/finishworkout` → server creates a row in **`workout_summary`** with `user_id`, `workout_start_utc`, `workout_end_utc` (or the trigger fills defaults). All tracking rows for this workout point to this summary via `workout_summary_id`.
2. **Record sets** – Each set is inserted into `exercisetracking` and must include `workout_summary_id` (created in step 1). **The user and the workout timestamps are taken from `workout_summary`, not from the tracking row.**
3. **Analytics aggregation** – Views (`v_exercisetracking_expanded`, `v_exercisetracking_set_simple`, `v_prs`) read from `exercisetracking` **and** join `workout_summary` to know the real workout window. This is what powers `/workouts/gettracking` 45‑day analytics. 
4. **Housekeeping** – `public.housekeeping_compact_old_workouts()` keeps only the most recent 35 workout-days per user and deletes tracking of older days based on **`workout_summary.workout_start_utc`** (so a single long workout with many sets is deleted as a unit).

---

### Messages Flow

> 🖼 **DB Messages Flow diagram**

![Database messages flow](https://github.com/user-attachments/assets/9a87b874-be46-403e-bfbc-c3709175767f)

1. **Compose Message** – System inserts message.
2. **Receive & Read** – Users fetch inbox, mark read.
3. **Delete** – Delete request marks record as deleted.

---

### Auth Flow

> 🖼 **DB Auth Flow diagram**

![Database authentication flow](https://github.com/user-attachments/assets/eb0c0c2a-84bc-4409-9b7a-b7019c1ebd27)

1. **Login & Token Issuance** – Access + refresh tokens created; when DPoP is enabled, tokens include a confirmation claim bound to the client key.
2. **Access Control** – All protected API requests require access token + DPoP proof.
3. **Token Refresh** – Refresh rotates both tokens; the request must include a valid DPoP proof whose key material matches the token’s confirmation.

---

### Reminder flow (New)

> 🖼 **DB Auth Flow diagram**

![Database authentication flow](https://github.com/user-attachments/assets/39a0c9fb-aba8-4e27-8c6d-2568167e546c)

This feature connects the **DB-level daily computation** with the **API-level hourly push** to deliver **personalized workout reminders**.

- **Tables involved:**
  - `public.user_reminder_settings` – per-user settings (enabled, offset minutes). Defaults are auto-filled.
  - `public.user_split_information` – per user+split estimated UTC time + preferred weekday + confidence. Filled by the daily cron.
  - `public.workoutsplits` – to get the actual split name for the push.
  - `public.exercisetracking` + `public.workout_summary` – source events for the daily computation.

---

## WebSocket Events

The backend uses **Socket.IO** (WebSocket transport only) to deliver realtime events such as new messages and system notifications.  
Each authenticated user is assigned to a **dedicated room** named after their `userId`, enabling targeted event delivery.

### Connection Flow

1. **Client-side ticket minting**

   - The app requests a short-lived **connection ticket** via:
     ```text
     POST /api/ws/generateticket
     ```
   - The server issues a signed JWT (audience: `socket`, issuer: `strong-together`) valid for **~1.5 hours**.
   - Ticket payload includes `{ id, username, jti }`.

2. **Handshake authentication**

   - Client connects to the WebSocket endpoint:
     ```js
     io(API_BASE_URL, {
       path: "/socket.io",
       transports: ["websocket"],
       auth: { ticket },
     });
     ```
   - The backend intercepts connections through:
     ```js
     io.use(async (socket, next) => {
       const ticket = socket.handshake.auth.ticket;
       const payload = decodeSocketToken(ticket);
       socket.user = { id: payload.id, username: payload.username };
       next();
     });
     ```

3. **Room assignment**

   - After validation, each socket joins a private room:
     ```js
     socket.join(userId);
     ```
   - This room name equals the user’s internal `id`, ensuring isolation between users.

4. **Event lifecycle**

   - On login: client emits `user_loggedin`.
   - On new message: server emits `new_message` to that user’s room.
   - On disconnect: logs reason and allows automatic reconnection.

5. **Automatic reconnection**
   - If the app goes to background or network drops, the socket may close (`ping timeout`).
   - On reconnect attempt, if the ticket is expired, the client **requests a new ticket** and reconnects automatically.
   - This prevents stale sessions without spamming reconnections.

### Security Highlights

| Layer                    | Protection                                                                  |
| ------------------------ | --------------------------------------------------------------------------- |
| **Ticket JWT**           | Signed with `JWT_SOCKET_SECRET`, short TTL (~1.5h), audience `socket`.      |
| **Handshake middleware** | Rejects missing, invalid, or expired tickets before connection is accepted. |
| **Isolation**            | Each user’s socket joins only its own room.                                 |
| **Reconnection safety**  | The client refreshes tickets only when needed (on `connect_error`).         |

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

```text
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
