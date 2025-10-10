# Strong Together Backend (v1.7.0)

**Strong Together** is a fitness-oriented application.  
This repository contains the backend server that powers the app.  
It exposes a REST API for user registration and authentication, workout planning and tracking, messaging, exercises, and push notifications.

The backend is built with **Node.js** and **Express**, uses **PostgreSQL** as its main database, **Redis** for caching, **Socket.IO** for realtime events, **JWT** for authentication, **Zod** for schema validation, and integrates with **Supabase Storage** and the **Expo push notification service**.  
It also uses **Resend** for transactional email (account verification & password reset).

The application is containerized with **Docker** and currently deployed on **Render**.  
Previously, the project used **Supabase Client** directly from the frontend as a BaaS (Backend as a Service).  
Migrating to this dedicated backend improved performance, introduced server-side caching, and provided a more professional and maintainable architecture.

---

## Table of Contents

1. [Technologies & Architecture](#technologies--architecture)
2. [Project Structure](#project-structure)
3. [Middleware & Security](#middleware--security)
4. [Caching](#caching)
5. [Running the Server](#running-the-server)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [Users](#users)
   - [Exercises](#exercises)
   - [Messages](#messages)
   - [Workouts](#workouts)
   - [Analytics](#analytics)
   - [Bootstrap](#bootstrap)
   - [Aerobics](#aerobics)
   - [Push Notifications](#push-notifications)
7. [Database Models & Indexes](#database-models--indexes)
   - [Database Schema](#database-schema)
   - [Workout Flow](#workout-flow)
   - [Tracking Flow](#tracking-flow)
   - [Messages Flow](#messages-flow)
   - [Auth Flow](#auth-flow)
8. [WebSocket Events](#websocket-events)
9. [Conclusion](#conclusion)

---

## Technologies & Architecture

| Layer/Service           | Purpose/Notes                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Node.js / Express 5** | HTTP server and routing framework. Express 5 provides promise‑aware request handlers.                                                                                                                                                                                                                  |
| **PostgreSQL**          | Primary relational database. SQL queries live in `src/queries`. The code relies on Postgres views (e.g. `v_exercisetracking_expanded`) to assemble workout plans and analytics.                                                                                                                        |
| **Redis**               | Cache layer. When `CACHE_ENABLED=true`, workout plans and exercise tracking results are cached for 48h. **Payloads are GZIP‑compressed** to reduce size and network time. Each user has a cache‑version; on data changes the version increments to invalidate.                                         |
| **Socket.IO**           | WebSockets server used to emit `new_message` events when system or user messages arrive. Clients join a room named after their user ID to receive targeted events.                                                                                                                                     |
| **Supabase Storage**    | Used for storing user profile pictures. Files are uploaded and retrieved via signed service‑role keys.                                                                                                                                                                                                 |
| **Expo Push service**   | Sends push notifications to users’ devices. The server exposes an example `/api/push/daily` endpoint that loops over tokens and calls Expo’s API.                                                                                                                                                      |
| **Resend (Email)**      | Transactional email for **account verification** and **password reset** flows.                                                                                                                                                                                                                         |
| **JWT**                 | Auth with short‑lived access tokens (15 min) and long‑lived refresh tokens (30 days). **Per‑user `tokenVersion` enforces single active device** and prevents stale sessions when the frontend uses SWR. **Note:** a blacklist table exists but is **currently disabled** due to Supabase space limits. |
| **Docker & Compose**    | Dockerfile produces Node 20 image, `docker-compose.yml` maps port 5000 to host.                                                                                                                                                                                                                        |
| **Render Deployment**   | The backend is deployed on Render for hosting and scaling.                                                                                                                                                                                                                                             |

---

## Project Structure

```
src/
├── config/        # DB/Redis/socket configuration
├── controllers/   # Route handlers
├── middlewares/   # Middlewares (auth, validation, upload, rate limiting, etc.)
├── queries/       # Parameterised SQL queries for Postgres
├── routes/        # Express route definitions
├── services/      # Domain services (messaging, push notifications, storage)
├── templates/     # Predefined message templates
├── utils/         # Helpers (tokens, Redis, sockets)
└── validators/    # Zod schemas for validation
```

---

## Middleware & Security

| Middleware                           | Purpose                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| **cors**                             | Configured for any origin with credentials.                         |
| **cookie‑parser**                    | Parses cookies from incoming requests.                              |
| **express.json**                     | Parses JSON bodies.                                                 |
| **helmet**                           | Adds security headers.                                              |
| **generalLimiter**                   | Rate‑limits (100 req/min/IP).                                       |
| **botBlocker**                       | **Blocks malicious bots and scanners (NEW).**                       |
| **checkAppVersion**                  | **Enforces minimum app version (NEW).**                             |
| **asyncHandler**                     | Wraps handlers, forwards errors.                                    |
| **authMiddleware (protect)**         | Verifies JWT, checks blacklist, attaches `req.user`.                |
| **roleMiddleware (authorizeRoles)**  | Restricts routes by roles (e.g. admin, currently unused).           |
| **withRlsTx**                        | **Manages RLS and Transactions (NEW).**                             |
| **validateRequest**                  | Validates `req.body` with Zod schemas.                              |
| **uploadImage**                      | Handles multipart uploads (images ≤10 MB, only JPEG/JPG/PNG/WebP).  |
| **errorHandler**                     | Central error handler with JSON responses.                          |

**Other Security Measures:**

- **Atomic CAS (Compare-and-Set) Refresh (NEW):** The `POST /auth/refresh` endpoint now uses an atomic operation to validate the current `tokenVersion`, issue new tokens, and increment the version in one step, preventing race conditions and ensuring strong token rotation.
- **Token TTL Policy (NEW):** Access Tokens are valid for **5 minutes** (short-lived) and Refresh Tokens for **14 days** (long-lived).
- **App Version Enforcement:** The **`checkAppVersion`** middleware ensures clients are running at least the version specified by the server's `MIN_APP_VERSION` environment variable.
- **Blacklist currently disabled** – Although a blacklist table exists, it is **not used at the moment** due to Supabase space limits.
- **Single‑device sessions via `tokenVersion`** – Each user has an integer `tokenVersion`. All issued tokens embed the version; bumping it invalidates existing tokens instantly.
- **Bot/Scanner Blocker:** The **`botBlocker`** middleware drops requests that exhibit highly suspicious patterns to protect against common attacks and vulnerability scans.
- Password hashing with **bcrypt (10 salt rounds)**.
- CORS + **Rate Limiting (30 req/min)** enabled, trust proxy for real client IP.
- Input validation on all public endpoints (Zod).
- File upload filtering (image types only, max 10 MB).

---

## Caching

- **Compression (NEW):** cache payloads are **GZIP‑compressed** before writing to Redis and decompressed on read. This reduces Redis memory footprint and network transfer time (especially over cellular).
- Controlled by `CACHE_ENABLED`.
- Workout plan (`/api/workouts/getworkout`) and exercise analytics (`/api/workouts/gettracking`) are cached under `{namespace}:{userId}:v{n}` where `v{n}` is the user’s cache‑version.
- TTLs:
  - Plan cache: 48h (configurable via `CACHE_TTL_PLAN_SEC`)
  - Tracking cache: 48h (configurable via `CACHE_TTL_TRACKING_SEC`)
- `X-Cache` response header exposes `HIT` / `MISS`.

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

> **Timezone note (`tz`)**: several endpoints accept a `tz` query parameter (IANA zone string, e.g., `Asia/Jerusalem`) to compute day boundaries server‑side.

### Authentication

| Method | Endpoint                      | Auth? | Body / Query                                                    | Description                                                                             |
| ------ | ----------------------------- | ----- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| POST   | `/auth/login`                 | No    | `{ identifier, password }`                                      | Login by username **or** email. Returns `accessToken`, `refreshToken`, and `user` ID.   |
| POST   | `/auth/refresh`               | No    | Header `x-refresh-token` (or cookie/body via `getRefreshToken`) | Rotates session: issues fresh access/refresh if `tokenVersion` matches.                 |
| POST   | `/auth/logout`                | No    | Header/body `x-refresh-token`                                   | Clears Expo push token for the user. (Blacklist storage disabled due to space limits.)  |
| GET    | `/auth/verify`                | No    | Query `?token=...`                                              | Verifies account from email link and returns an HTML confirmation page.                 |
| POST   | `/auth/sendverificationemail` | No    | `{ email }`                                                     | Sends a verification email (via Resend). `204 No Content` on success.                   |
| PUT    | `/auth/changeemailverify`     | No    | `{ username, password, newEmail }`                              | Updates email **before** verification and resends a verification email (via Resend).    |
| GET    | `/auth/checkuserverify`       | No    | Query `?username=...`                                           | Returns `{ isVerified: boolean }`.                                                      |
| POST   | `/auth/forgotpassemail`       | No    | `{ identifier }`                                                | Sends password‑reset email (via Resend). `204 No Content` regardless of user existence. |
| PUT    | `/auth/resetpassword`         | No    | Query `?token=...`, Body `{ newPassword }`                      | Resets password using token issued by forgot‑password flow.                             |

### Users

| Method | Endpoint                  | Auth? | Body / Params                                                                   | Description                                                                |
| ------ | ------------------------- | ----- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| POST   | `/users/create`           | No    | `{ username, fullName, email, password, gender }`                               | Register new user. Sends verification email (Resend).                      |
| GET    | `/users/get`              | Yes   | —                                                                               | Get authenticated user profile (aggregated JSON).                          |
| PUT    | `/users/updateself`       | Yes   | Any of: `username, fullName, email, gender, password, profileImgUrl, pushToken` | Update authenticated user; handles uniqueness checks and password hashing. |
| DELETE | `/users/deleteself`       | Yes   | —                                                                               | Delete own account.                                                        |
| PUT    | `/users/pushtoken`        | Yes   | `{ token }`                                                                     | Save Expo push token.                                                      |
| PUT    | `/users/setprofilepic`    | Yes   | multipart `file`                                                                | Upload a new profile picture to Supabase Storage.                          |
| DELETE | `/users/deleteprofilepic` | Yes   | `{ path }`                                                                      | Delete profile picture from Supabase & clear from user profile.            |

### Exercises

| Method | Endpoint            | Auth? | Description            |
| ------ | ------------------- | ----- | ---------------------- |
| GET    | `/exercises/getall` | Yes   | Returns all exercises. |

### Messages

| Method | Endpoint                    | Auth? | Body / Params   | Description                                |
| ------ | --------------------------- | ----- | --------------- | ------------------------------------------ |
| GET    | `/messages/getmessages`     | Yes   | Optional `?tz=` | Get inbox messages (sender pics resolved). |
| PUT    | `/messages/markmasread/:id` | Yes   | URL `id`        | Mark a message as read.                    |
| DELETE | `/messages/delete/:id`      | Yes   | URL `id`        | Delete a message.                          |

### Workouts

| Method | Endpoint                  | Auth? | Body / Query                        | Description                                                              |
| ------ | ------------------------- | ----- | ----------------------------------- | ------------------------------------------------------------------------ |
| GET    | `/workouts/getworkout`    | Yes   | Optional `?tz=`                     | Get active workout plan (cached).                                        |
| GET    | `/workouts/gettracking`   | Yes   | Optional `?tz=`                     | Get 45‑day exercise analytics (cached).                                  |
| POST   | `/workouts/finishworkout` | Yes   | `{ workout: Array, tz }`            | Save completed workout; warms tracking cache and sends a system message. |
| POST   | `/workouts/add`           | Yes   | `{ workoutData, workoutName?, tz }` | Create a new workout plan; invalidates/warm‑caches plan + analytics.     |
| DELETE | `/workouts/delete`        | Yes   | —                                   | **Temporarily disabled** (no‑op in controller).                          |

### Analytics

| Method | Endpoint         | Auth? | Description                               |
| ------ | ---------------- | ----- | ----------------------------------------- |
| GET    | `/analytics/get` | Yes   | Returns `{ _1RM, goals }` (Redis‑cached). |

### Bootstrap

| Method | Endpoint         | Auth? | Query / Body    | Description                                                                                       |
| ------ | ---------------- | ----- | --------------- | ------------------------------------------------------------------------------------------------- |
| POST   | `/bootstrap/get` | Yes   | Optional `?tz=` | Returns bundled payload: `{ user, workout, tracking, aerobics, messages }` (tracking window 45d). |

### Aerobics

| Method | Endpoint        | Auth? | Body / Query     | Description                                                        |
| ------ | --------------- | ----- | ---------------- | ------------------------------------------------------------------ |
| GET    | `/aerobics/get` | Yes   | Optional `?tz=`  | Returns user's aerobic sessions map for the last 45 days (cached). |
| POST   | `/aerobics/add` | Yes   | `{ record, tz }` | Adds an aerobic record and returns the refreshed 45‑day payload.   |

### Push Notifications

| Method | Endpoint      | Auth? | Description                                    |
| ------ | ------------- | ----- | ---------------------------------------------- |
| GET    | `/push/daily` | No    | Test endpoint that sends a demo push via Expo. |

**Operational note:** A **daily external cron job** triggers the push workflow every day at **08:30** (local time) to deliver scheduled notifications.

---

## Database Models & Indexes

- Uses **Postgres** with parameterised queries.
- Views: `v_exercisetoworkoutsplit_expanded`, `v_exercisetracking_expanded`.
- **Blacklist table** exists for revoked JWTs with TTL cleanup, **but is currently disabled** due to Supabase space limits.
- Unique constraints on `username` and `email`.
- Column **`users.tokenVersion`** (int, default 0) – embedded into JWTs to enforce single‑device sessions and to kill stale tokens on demand.
- **UPSERT‑friendly uniqueness** for workout structures:
    - `workoutplans`: a single active plan per user (e.g., partial unique index on `(user_id)` where `is_active = TRUE`).
    - `workoutsplits`: unique per plan on `(workout_id, name)` to allow idempotent updates.
    - `exercisetoworkoutsplit`: unique per split on `(workoutsplit_id, exercise_id)` (plus `order_index` as data) to enable upserts.
- Table **`aerobictracking`** – logs aerobic/cardio sessions (e.g., `type`, `duration_mins`, `duration_sec`, `workout_date`) per user for non‑strength activities.
- Soft‑deletes / toggling: `is_active` is used on splits and ETS rows to deactivate removed items during plan updates.

### Row Level Security (RLS) & Transaction Management (NEW)

The backend implements a robust server-side **Row Level Security (RLS)** layer to ensure data ownership and integrity.

1.  **RLS Middleware (`withRlsTx`):** This critical middleware uses **Node.js `AsyncLocalStorage`** to manage database connections. For every authenticated request, it:
    - Opens a dedicated **transaction** (`BEGIN`).
    - Sets the Postgres **`ROLE`** to `authenticated`.
    - Injects the user's ID (`req.user.id`) and JWT claims into the database session using `SET app.jwt.claims...`.
    - This ensures that all downstream queries are automatically scoped and protected by RLS Policies.
2.  **RLS Policies (Database Enforcement):** Policies are defined in Postgres to restrict data access based on the authenticated user's ID (`auth.uid()`):
    - **Direct Ownership:** Policies on top-level tables (`workoutplans`, `exercisetracking`, etc.) enforce that users can only read/write their own rows (`user_id = auth.uid()`).
    - **Cascading Ownership:** Policies on nested tables (`workoutsplits`, `exercisetoworkoutsplit`) use joins to confirm that the split or exercise belongs to a plan owned by the authenticated user. This prevents unauthorized modification of subordinate data.
3.  **Transaction Safety:** The core logic (e.g., `queryAddWorkout`) is now executed within the single, wrapping transaction initiated by `withRlsTx`. This guarantees **Atomicity** (all-or-nothing changes) for complex, multi-step operations like updating a workout plan.
4.  **Public Endpoints Fallback:** Public endpoints (e.g., `/users/create`) automatically **skip** the RLS setup but utilize the global database client. For public actions involving multiple queries (which could compromise data integrity if one fails), **manual transaction management** (`sql.begin`) is used to maintain Atomicity.

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
4. **Cache invalidation** – After a successful update, the user’s cache‑version increments so clients fetch fresh data.
   > **Why UPSERT?**
   >
   > - Avoids churn of creating new plans on every edit
   > - Preserves stable IDs for splits/exercises (better analytics & references)
   > - Minimizes writes and reduces race conditions
   > - Plays nicely with SWR on the client (precise invalidation via cache‑version)

### Tracking Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/21dba52e-1cb9-459c-a2f6-2b4e9a3e9588)

1. **Select a split** – User opens a split.
2. **Record Sets** – Weight/repetitions logged into `exercisetracking`.
3. **Review Progress** – Data aggregated for analytics.
4. **Aerobic tracking:** In addition to strength sets, the backend stores cardio sessions in `aerobictracking` (type + duration) so progress can include non‑strength work.

### Messages Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/d0e6754a-9123-4443-9fe5-eaecca6885a8)

1. **Compose Message** – System inserts message.
2. **Receive & Read** – Users fetch inbox, mark read.
3. **Delete** – Delete request marks record as deleted.

### Auth Flow

![Database authentication flow](https://github.com/user-attachments/assets/1516ac04-941f-4792-a4c9-31036a1d9de2)

1. **Login & Token Issuance** – Access + refresh tokens created.
2. **Access Control** – All API requests require access token.
3. **Token Refresh** – Refresh token rotates session.
4. **Blacklisting** – Revoked tokens stored in blacklist table.

---

## WebSocket Events

- Clients connect via `/socket.io`.
- Emit `user_loggedin` with ID → join room.
- New messages broadcast `new_message` to user’s room.

---

## Conclusion

The backend provides a secure, modular API for **Strong Together** fitness app.  
Built with **Node.js**, **Postgres**, **Redis**, **JWT**, and **Socket.IO**.  
Security: JWT rotation, blacklist, bcrypt, rate limiting, CORS, Zod validation.  
Performance: Redis caching.  
Deployment: Containerized with Docker, hosted on Render.  
Previously used Supabase client directly from frontend, now optimized with a dedicated backend.  
Extensible and production‑ready.
