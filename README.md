# Strong Together Backend (v3.0.0)

**Strong Together** is a fitness-oriented application.  
This repository contains the backend server that powers the app.  
It exposes a **microservices** REST API for user registration and authentication, workout planning and tracking, messaging, exercises, push notifications, **and async video-analysis workflows**.

## 🚀 System Overview

This backend is a production-grade system that:

- Handles authentication with JWT + DPoP (proof-of-possession)
- Processes heavy video analysis using a **Python microservice**
- Uses **Redis queues and Pub/Sub** for async workflows
- Streams real-time results to clients via **WebSockets**
- Stores media in **AWS S3** with presigned uploads

### Architecture flow (video analysis):

Client → Node API → S3 upload → Redis Queue → Python Service → Redis Pub/Sub → Node → WebSocket → Client

> **Security-first note:** The authentication layer uses **JWTs bound with DPoP (Demonstration of Proof-of-Possession)**. Tokens are cryptographically tied to a client-held key and validated per request with a DPoP proof. Details and client requirements appear below.

The backend is built with **Node.js** and **Express**, uses **PostgreSQL** as its main database, **Redis** for caching, queues, Pub/Sub, and optional Socket.IO scaling, **Socket.IO** for realtime events, **JWT** for authentication, **Zod** for schema validation, and integrates with **AWS S3**, the **Expo push notification service**, and **Resend** for transactional email.  
It now also includes a dedicated **Python Computer Vision service** for exercise video analysis with **OpenCV** and **MediaPipe**, plus **Pino** for structured logging and **Sentry** for error tracking and tracing.

## What's New

This phase introduced the biggest backend jump the project has had so far.
Since v2.2.0, the project also went through a major backend upgrade:

- full migration from JavaScript to **TypeScript**
- **microservices-oriented** architecture for video analysis
- **Zod-first** request validation plus **response schemas**
- a full **integration test** suite across the main API domains
- **Pino**-based structured logging with redaction
- **Sentry** tracing/error monitoring in both Node and Python runtimes
- **AWS S3** presigned uploads for media analysis files
- A dedicated **Python service** now analyzes uploaded videos and returns results in realtime through Redis + Socket.IO
- **Redis Pub/Sub** to bring analysis results back to the main server

Overall, this was a major step forward in maintainability, reliability, observability, and scalability. The backend is now much closer to a production-grade service platform than the version represented by the older commit.

#### OAuth Providers & Account Linking (Google + Apple)

The backend supports **OAuth 2.0** sign-in with **Google** and **Apple** and automatically **links multiple providers** to a single internal user.

The application is containerized with **Docker** and currently deployed on **Render**.  
Previously, the project used **Supabase Client** directly from the frontend as a BaaS (Backend as a Service).  
Migrating to this dedicated backend improved performance, introduced server-side caching, and provided a more professional and maintainable architecture.

---

## Table of Contents

1. [System Overview](#-system-overview)
2. [What's New](#whats-new)
3. [OAuth Providers & Account Linking](#oauth-providers--account-linking-google--apple)
4. [Technologies & Architecture](#technologies--architecture)
5. [Project Structure](#project-structure)
6. [Middleware & Security](#middleware--security)
7. [Background Jobs, Queues & Microservices](#background-jobs-queues--microservices)
8. [Observability (Pino + Sentry)](#observability-pino--sentry)
9. [Running the Server](#running-the-server)
10. [Testing](#testing)
11. [API Endpoints](#api-endpoints)
12. [Authentication](#authentication)
13. [Users](#users)
14. [OAuth](#oauth)
15. [Workouts](#workouts)
16. [Messages](#messages)
17. [Exercises](#exercises)
18. [Analytics](#analytics)
19. [Bootstrap](#bootstrap)
20. [Aerobics](#aerobics)
21. [Push Notifications](#push-notifications)
22. [WebSocket](#websocket)
23. [Video Analysis](#video-analysis)
24. [Database Models & Indexes](#database-models--indexes)
25. [Database Schema](#database-schema)
26. [Workout Flow](#workout-flow)
27. [Tracking Flow](#tracking-flow)
28. [Messages Flow](#messages-flow)
29. [Auth Flow](#auth-flow)
30. [Reminder Flow](#reminder-flow-new)
31. [WebSocket Events](#websocket-events)
32. [Connection Flow](#connection-flow)
33. [Security Highlights](#security-highlights)
34. [DPoP (Proof-of-Possession) Overview](#dpop-proof-of-possession-overview)
    1. [How DPoP Works Here](#how-dpop-works-here)
    2. [Required Headers From Client](#required-headers-from-client)
    3. [Environment Variables](#environment-variables)
35. [Conclusion](#conclusion)

---

## Technologies & Architecture

| Layer/Service                 | Purpose/Notes                                                                                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js / Express 5**       | HTTP server and routing framework. Express 5 provides promise-aware request handlers.                                                                                                                               |
| **TypeScript**                | The Node server, routes, controllers, middlewares, queries, workers, queues, validators, DTOs, and shared runtime code were migrated to TypeScript for stronger safety and maintainability.                         |
| **PostgreSQL**                | Primary relational database. SQL queries live in `src/queries`. The code relies on Postgres views (e.g. `v_exercisetracking_expanded`) to assemble workout plans and analytics.                                     |
| **Redis**                     | Cache layer, queue backing store, Pub/Sub transport for video-analysis results, JTI replay protection, and optional Socket.IO Redis adapter support.                                                                |
| **Socket.IO**                 | Secure WebSocket layer for realtime events (messages, notifications, video-analysis results). Each client must first request a short-lived **connection ticket** (`/api/ws/generateticket`) before connecting.      |
| **AWS S3**                    | Used for video-analysis uploads through presigned URLs. Clients upload directly to S3, and the Python service downloads the media for processing.                                                                   |
| **Supabase Storage**          | Still used for user profile pictures and related media-storage flows.                                                                                                                                               |
| **Expo Push service**         | Sends push notifications to users’ devices. The server exposes endpoints and workers that enqueue and deliver reminders and daily pushes.                                                                           |
| **Resend (Email)**            | Transactional email for **account verification** and **password reset** flows.                                                                                                                                      |
| **JWT + DPoP**                | Auth uses short-lived access tokens and longer-lived refresh tokens. Tokens are **DPoP-bound** and validated per request with a DPoP proof to prevent replay with a stolen token.                                   |
| **Zod**                       | Used for request validation and now also for **response schemas**, which help enforce API contract consistency.                                                                                                     |
| **Pino**                      | Structured application logging with per-request context, child loggers, request IDs, and redacted sensitive fields.                                                                                                 |
| **Sentry**                    | Error tracking and tracing for the Node server, workers, and Python analysis service. Used heavily in the video-analysis path.                                                                                      |
| **Docker & Compose**          | Separate Dockerfiles now exist for the main server, workers, and Python service to support a more service-oriented deployment model.                                                                                |
| **Render Deployment**         | The backend is deployed on Render for hosting and scaling.                                                                                                                                                          |
| **Bull + Redis (Queues)**     | Handles background jobs for push notifications, transactional emails, and video-analysis dispatching.                                                                                                               |
| **Python FastAPI service**    | Dedicated Computer Vision service that analyzes uploaded workout videos and publishes results back via Redis Pub/Sub.                                                                                               |
| **Workout summary layer**     | New layer used to normalize per-workout metadata (`workout_start_utc`, `workout_end_utc`) and link it to `exercisetracking`. This is now the **authoritative source** for workout boundaries.                       |
| **Reminder subsystem**        | New subsystem based on `user_split_information` + `user_reminder_settings` tables. A daily DB cron recomputes preferred weekday + estimated hour per split, and an hourly server cron turns these into Expo pushes. |
| **Integration testing stack** | `Vitest` + `Supertest` + dedicated test DB reset tooling validate request/response contracts and end-to-end backend flows.                                                                                          |

---

## Project Structure

```text
src/
├── app.ts           # Express app composition
├── index.ts         # Express server entry point
├── instrument.ts    # Sentry bootstrap
├── aws/             # AWS S3 helpers
├── config/          # Database, Redis, logger, Sentry, and Socket.IO configuration
├── controllers/     # Express route controllers (business logic)
├── middlewares/     # Custom middlewares (auth, validation, DPoP, rate-limiters, etc.)
├── queries/         # Parameterized SQL queries — each controller has its own queries file
├── queues/          # Queue producers and queue initializers
│   ├── analyzeVideo/
│   ├── emails/
│   └── pushNotifications/
├── routes/          # Express route definitions
├── services/        # Domain-level services (storage, messaging, caching, etc.)
├── subscribers/     # Redis Pub/Sub subscribers
├── templates/       # Email HTML templates (Resend)
├── types/           # API request/response types, DTOs, entities, Express extensions
├── utils/           # General-purpose utilities (tokens, Redis helpers, sockets, etc.)
├── validators/      # Zod schemas for validating incoming requests and responses
└── index.ts         # Express server entry point

workers/
├── utils/
│   └── setupGracefulShutdown.ts
├── analyzeVideoWorker.ts
├── emailsWorker.ts
├── pushNotificationsWorker.ts
└── globalWorker.ts

pythonService/
├── analyzers/       # Computer Vision / exercise analysis logic
├── aws/
├── config/
├── publishers/      # Redis publishers for analysis results
├── routes/
├── services/
├── utils/
└── main.py          # Python FastAPI entry point

tests/
├── aerobics/
├── analytics/
├── auth/
├── bootstrap/
├── exercises/
├── messages/
├── oauth/
├── users/
├── videoanalysis/
├── websockets/
├── workouts/
├── helpers/
└── setup/
```

---

## Middleware & Security

| Middleware                          | Purpose                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **cors**                            | Configured for the application’s allowed origins.                                                                       |
| **express.json**                    | Parses JSON bodies.                                                                                                     |
| **helmet**                          | Adds security headers.                                                                                                  |
| **generalLimiter**                  | Rate-limits incoming requests.                                                                                          |
| **botBlocker**                      | Blocks malicious bots and scanners.                                                                                     |
| **checkAppVersion**                 | Enforces minimum app version via `MIN_APP_VERSION`.                                                                     |
| **dpopValidationMiddleware**        | Verifies DPoP proof: signature, `typ`, `htm`, strict origin+path validation, short `iat` window, and replay protection. |
| **asyncHandler**                    | Wraps handlers and forwards errors.                                                                                     |
| **authMiddleware (protect)**        | Verifies JWT, checks `tokenVersion`, and **matches the token’s DPoP confirmation** with the live proof.                 |
| **roleMiddleware (authorizeRoles)** | Restricts routes by roles (currently mostly unused).                                                                    |
| **withRlsTx**                       | Manages RLS + transaction per request (sets role/claims, wraps multi-query ops atomically).                             |
| **validate**                        | Validates `req.body`, `req.query`, and `req.params` with Zod schemas.                                                   |
| **uploadImage**                     | Handles multipart uploads (images ≤10 MB, only JPEG/JPG/PNG/WebP).                                                      |
| **errorHandler**                    | Central error handler with JSON responses.                                                                              |

**Other Security Measures:**

- **Atomic CAS Refresh:** `POST /auth/refresh` validates current `tokenVersion`, issues new tokens, and increments the version atomically.
- **Short-lived access tokens** and **longer-lived refresh tokens**.
- **Single-device sessions via `tokenVersion`.**
- **Bot/Scanner blocker** and **rate limiting** on public endpoints.
- **Password hashing** with bcrypt.
- **Strict input validation** with Zod.
- **Response contract coverage** with Zod response schemas in tests and shared validators.
- **Replay protection** for DPoP JTIs via Redis-backed caching.
- **Request correlation** through request IDs and structured logs.

---

## Background Jobs, Queues & Microservices

The backend uses **Redis** and **Bull** to manage background job processing for notifications, emails, and video-analysis dispatching.

### Queues (Producers)

| Queue               | Purpose                                                                              | Producer Path                                               |
| ------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `pushNotifications` | Enqueues push notification jobs to be sent via the **Expo Push API**.                | `src/queues/pushNotifications/pushNotificationsProducer.ts` |
| `emails`            | Enqueues transactional email jobs (verification, password reset) via **Resend API**. | `src/queues/emails/emailsProducer.ts`                       |
| `analyzeVideo`      | Enqueues video-analysis jobs that are later dispatched to the Python service.        | `src/queues/analyzeVideo/analyzeVideoProducer.ts`           |

Each producer encapsulates the logic of creating a job and adding it to the corresponding queue instance.

### Workers (Consumers)

| Worker                    | Purpose                                                                              | Worker Path                              |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------- |
| `pushNotificationsWorker` | Processes push jobs and delivers messages to Expo Push service.                      | `workers/pushNotificationsWorker.ts`     |
| `emailsWorker`            | Processes email jobs using the **Resend API**.                                       | `workers/emailsWorker.ts`                |
| `analyzeVideoWorker`      | Consumes video-analysis queue jobs and forwards them to the Python analysis service. | `workers/analyzeVideoWorker.ts`          |
| `globalWorker`            | Initializes all queues together (for local or container deployment).                 | `workers/globalWorker.ts`                |
| `setupGracefulShutdown`   | Handles safe shutdown for workers to close connections cleanly.                      | `workers/utils/setupGracefulShutdown.ts` |

### Microservice video-analysis flow

1. The client requests a presigned upload URL from `POST /api/videoanalysis/getpresignedurl`.
2. The Node server generates an **AWS S3** upload URL and returns a `fileKey`.
3. The client uploads the video directly to S3.
4. The client calls `POST /api/videoanalysis/publishjob`.
5. The main backend enqueues an `analyzeVideo` job in Redis.
6. `workers/analyzeVideoWorker.ts` consumes the job and calls the Python service.
7. The **Python FastAPI service** downloads the video from S3, analyzes the exercise, and deletes the file afterwards.
8. The Python service publishes the result to Redis Pub/Sub channel `video-analysis:results`.
9. The Node backend subscribes to that channel and emits the result to the correct user through Socket.IO.

![diagram](https://github.com/user-attachments/assets/e8c8d6fc-1d50-4adb-98f3-701bb570c069)

### Python analysis service

The project now includes a dedicated **Python FastAPI service** for exercise-video analysis.

This service is responsible for:

- downloading the uploaded video from **AWS S3**
- processing the video frames
- running pose / movement analysis
- publishing the analysis result back to Redis Pub/Sub
- cleaning up the video file after processing

For the analysis pipeline I used:

- **OpenCV** for frame/video processing
- **MediaPipe** for pose landmark detection

At the moment, the only supported exercise is:

- **Squat**

The current flow is:

1. The Python service downloads the video from S3 using the provided `fileKey`.
2. The video is read frame-by-frame.
3. Pose landmarks are extracted with **MediaPipe**.
4. The analysis logic uses those landmarks to evaluate squat movement and repetitions.
5. A result payload is generated and published back through Redis Pub/Sub.
6. The Node backend receives that payload and emits it to the correct user over Socket.IO.

### Why are the benefits of microservices here and why use AWS S3?

- heavy Computer Vision work doesn't blocks the main API process
- media upload is offloaded to S3 instead of pushing large files through the Node server
- result delivery is now async and realtime
- the architecture is easier to scale independently by service type

---

## Observability (Pino + Sentry)

### Pino

The backend now uses **Pino** for structured logging.

- JSON logs in production
- pretty local output in development
- child loggers per module / request / worker / job
- request IDs attached to API traffic
- sensitive fields automatically redacted, including tokens, cookies, passwords, push tokens, and email-related fields

### Sentry

**Sentry** is now integrated in both the Node backend and the Python analysis service.

- request context is attached for API errors
- worker failures are captured with queue/job metadata
- video-analysis flow propagates trace context across services
- fatal shutdown paths flush pending telemetry before exit

This makes debugging much easier than before, especially around async jobs and cross-service failures.

---

## Running the Server

1. Create `.env` with values for:

```env
PORT=...
DATABASE_URL=postgres://...
REDIS_HOST=...
REDIS_PORT=...
REDIS_USERNAME=...
REDIS_PASSWORD=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_SOCKET_SECRET=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE=...
BUCKET_NAME=...
AWS_REGION=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=...
ANALYSIS_SERVER_URL=...
SYSTEM_USER_ID=...
CACHE_ENABLED=true
CACHE_TTL_TRACKING_SEC=...
CACHE_TTL_PLAN_SEC=...
MIN_APP_VERSION=...
SENTRY_DSN=...

# DPoP settings
DPOP_ENABLED=true
PUBLIC_BASE_URL=https://<prod-host>
PUBLIC_BASE_URL_RENDER_DEFAULT=https://<render-host>
PRIVATE_BASE_URL_DEV=http://localhost:5000
```

2. Install dependencies and run the main server:

```bash
npm install
npm run start:server
```

3. Run workers:

```bash
npm run start:workers
```

4. Or run the services with Docker:

```bash
docker compose up --build
```

Current compose setup includes:

- `main-server`
- `background-workers`
- `python-service`

---

## Testing

The project now includes a dedicated **integration test** layer using **Vitest** + **Supertest**, along with a resettable Postgres test database.

### Test suites

| Suite          | File                                        |
| -------------- | ------------------------------------------- |
| Auth           | `tests/auth/login.test.ts`                  |
| Users          | `tests/users/user.test.ts`                  |
| Workouts       | `tests/workouts/workout.test.ts`            |
| Bootstrap      | `tests/bootstrap/bootstrap.test.ts`         |
| Messages       | `tests/messages/message.test.ts`            |
| Aerobics       | `tests/aerobics/aerobics.test.ts`           |
| Analytics      | `tests/analytics/analytics.test.ts`         |
| Exercises      | `tests/exercises/exercises.test.ts`         |
| OAuth          | `tests/oauth/oauth.test.ts`                 |
| Video Analysis | `tests/videoanalysis/videoanalysis.test.ts` |
| WebSockets     | `tests/websockets/websockets.test.ts`       |

### Useful commands

```bash
npm run test:db:reset
npm run test:auth
npm run test:users
npm run test:workouts
npm run test:bootstrap
npm run test:messages
npm run test:aerobics
npm run test:analytics
npm run test:exercises
npm run test:oauth
npm run test:videoanalysis
npm run test:websockets
npm run test:all
```

### What these tests cover

- request/response schemas
- auth and token flows
- user lifecycle operations
- workout creation/tracking flows
- bootstrap aggregation
- messaging behavior
- aerobics and analytics endpoints
- OAuth login flows
- video-analysis presigned URL and job publishing flows
- WebSocket ticket generation

---

## API Endpoints

Base path: `/api`

### System

| Method | Endpoint  | Auth | Description  |
| ------ | --------- | ---- | ------------ |
| GET    | `/`       | No   | Server ping  |
| GET    | `/health` | No   | Health check |

### Authentication

| Method | Endpoint                          | Auth | Description                                                     |
| ------ | --------------------------------- | ---- | --------------------------------------------------------------- |
| POST   | `/api/auth/login`                 | No   | Login with `identifier` + `password`; supports DPoP key binding |
| POST   | `/api/auth/refresh`               | No   | Rotate access/refresh tokens                                    |
| GET    | `/api/auth/verify`                | No   | Consume email verification token                                |
| POST   | `/api/auth/sendverificationemail` | No   | Send verification email                                         |
| PUT    | `/api/auth/changeemailverify`     | No   | Change email before verification and resend verification mail   |
| GET    | `/api/auth/checkuserverify`       | No   | Check whether a username is verified                            |
| POST   | `/api/auth/forgotpassemail`       | No   | Send password reset mail                                        |
| PUT    | `/api/auth/resetpassword`         | No   | Reset password using token                                      |
| POST   | `/api/auth/logout`                | Yes  | Logout and invalidate the session version                       |

### Users

| Method | Endpoint                      | Auth | Description                              |
| ------ | ----------------------------- | ---- | ---------------------------------------- |
| POST   | `/api/users/create`           | No   | Register a new app user                  |
| GET    | `/api/users/get`              | Yes  | Get the authenticated user profile       |
| PUT    | `/api/users/updateself`       | Yes  | Update username, full name, and/or email |
| PUT    | `/api/users/pushtoken`        | Yes  | Save Expo push token                     |
| PUT    | `/api/users/setprofilepic`    | Yes  | Upload and set profile picture           |
| DELETE | `/api/users/deleteprofilepic` | Yes  | Delete current profile picture           |
| DELETE | `/api/users/deleteself`       | Yes  | Delete the authenticated user            |
| GET    | `/api/users/changeemail`      | No   | Confirm deferred email change via token  |

### OAuth

| Method | Endpoint                 | Auth | Description                                   |
| ------ | ------------------------ | ---- | --------------------------------------------- |
| POST   | `/api/oauth/google`      | No   | Sign in / sign up with Google                 |
| POST   | `/api/oauth/apple`       | No   | Sign in / sign up with Apple                  |
| POST   | `/api/oauth/proceedauth` | Yes  | Finalize OAuth login once profile is complete |

### Workouts

| Method | Endpoint                      | Auth | Description                              |
| ------ | ----------------------------- | ---- | ---------------------------------------- |
| GET    | `/api/workouts/getworkout`    | Yes  | Get the user's workout plan              |
| GET    | `/api/workouts/gettracking`   | Yes  | Get workout tracking / analytics payload |
| POST   | `/api/workouts/finishworkout` | Yes  | Save a finished workout                  |
| POST   | `/api/workouts/add`           | Yes  | Create or update workout plan data       |

### Messages

| Method | Endpoint                       | Auth | Description            |
| ------ | ------------------------------ | ---- | ---------------------- |
| GET    | `/api/messages/getmessages`    | Yes  | Get all user messages  |
| PUT    | `/api/messages/markasread/:id` | Yes  | Mark a message as read |
| DELETE | `/api/messages/delete/:id`     | Yes  | Delete a message       |

### Exercises

| Method | Endpoint                | Auth | Description       |
| ------ | ----------------------- | ---- | ----------------- |
| GET    | `/api/exercises/getall` | Yes  | Get all exercises |

### Analytics

| Method | Endpoint             | Auth | Description        |
| ------ | -------------------- | ---- | ------------------ |
| GET    | `/api/analytics/get` | Yes  | Get user analytics |

### Bootstrap

| Method | Endpoint             | Auth | Description                        |
| ------ | -------------------- | ---- | ---------------------------------- |
| GET    | `/api/bootstrap/get` | Yes  | Get the combined bootstrap payload |

### Aerobics

| Method | Endpoint            | Auth | Description           |
| ------ | ------------------- | ---- | --------------------- |
| GET    | `/api/aerobics/get` | Yes  | Get aerobics data     |
| POST   | `/api/aerobics/add` | Yes  | Add aerobics activity |

### Push

| Method | Endpoint                   | Auth | Description                      |
| ------ | -------------------------- | ---- | -------------------------------- |
| GET    | `/api/push/daily`          | No   | Trigger daily push notifications |
| GET    | `/api/push/hourlyreminder` | No   | Trigger reminder pushes          |

### WebSocket

| Method | Endpoint                 | Auth | Description                        |
| ------ | ------------------------ | ---- | ---------------------------------- |
| POST   | `/api/ws/generateticket` | Yes  | Generate a signed WebSocket ticket |

### Video Analysis

| Method | Endpoint                             | Auth | Description                                      |
| ------ | ------------------------------------ | ---- | ------------------------------------------------ |
| POST   | `/api/videoanalysis/getpresignedurl` | Yes  | Get an AWS S3 presigned upload URL and `fileKey` |
| POST   | `/api/videoanalysis/publishjob`      | Yes  | Publish a video-analysis job to the queue        |

### API contract notes

- Protected routes use `Authorization: DPoP <accessToken>` when DPoP is enabled.
- Login and OAuth flows use `DPoP-Key-Binding` when DPoP binding is enabled.
- Most protected routes also pass through Zod validation before controller logic.

---

## Database Models & Indexes

- Uses **Postgres** with parameterised queries.
- Views: `v_exercisetoworkoutsplit_expanded`, `v_exercisetracking_expanded`, `v_exercisetracking_set_simple`, `v_prs` – **all of these join `exercise_tracking` → `workout_summary` and re-expose `user_id` and the workout timestamps.** The physical table `exercise_tracking` no longer stores `user_id` or `workout_time_utc`; the summary is the source of truth.
- Unique constraints on `username` and `email`.
- Column **`users.tokenVersion`** (int, default 0) – embedded into JWTs to enforce single-device sessions and to kill stale tokens on demand.
- **UPSERT-friendly uniqueness** for workout structures:
  - `workoutplans`: a single active plan per user (e.g., partial unique index on `(user_id)` where `is_active = TRUE`).
  - `workoutsplits`: unique per plan on `(workout_id, name)` to allow idempotent updates.
  - `exercisetoworkoutsplit`: unique per split on `(workoutsplit_id, exercise_id)` (plus `order_index` as data) to enable upserts.
- **Table `workout_summary`** – normalized table to capture per-workout start/end and link all `exercise_tracking` rows for that workout. This makes the summary the single source of truth for timestamps.
- Table **`user_split_information`** – filled by the daily DB cron to store per-user+split preferred weekday and **estimated_time_utc** plus a confidence level.
- Table **`user_reminder_settings`** – controls whether reminders are enabled and how many minutes before to remind. Defaults: `workout_reminders_enabled = true`, `reminder_offset_minutes = 60`.
- Table **`aerobictracking`** – logs aerobic/cardio sessions.
- Soft-deletes / toggling: `is_active` is used on splits and ETS rows to deactivate removed items during plan updates.
- **Housekeeping function** `public.housekeeping_compact_old_workouts()` relies on **`workout_summary` dates** instead of raw `exercisetracking.workout_time_utc`, so old workouts are deleted per **workout-day** and not per single set.

### Database Schema

The backend uses PostgreSQL as its primary datastore. The schema defines tables for users, messages, workout plans, splits, exercises and tracking logs, **including aerobic sessions via `aerobictracking`** and now **workout summaries** for better time analytics.

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
3. **Analytics aggregation** – Views (`v_exercisetracking_expanded`, `v_exercisetracking_set_simple`, `v_prs`) read from `exercisetracking` **and** join `workout_summary` to know the real workout window. This is what powers `/workouts/gettracking` 45-day analytics.
4. **Housekeeping** – `public.housekeeping_compact_old_workouts()` keeps only the most recent 35 workout-days per user and deletes tracking of older days based on **`workout_summary.workout_start_utc`**.

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

The backend uses **Socket.IO** to deliver realtime events such as new messages, system notifications, and video-analysis results.  
Each authenticated user is assigned to a **dedicated room** named after their `userId`, enabling targeted event delivery.

### Connection model

1. **Client-side ticket minting**
   - The app requests a short-lived **connection ticket** via `POST /api/ws/generateticket`.
   - The server issues a signed JWT (audience: `socket`, issuer: `strong-together`) valid for **~1.5 hours**.
   - Ticket payload includes `{ id, username, jti }`.
2. **Handshake authentication**
   - Client connects to `/socket.io` with `auth.ticket`.
   - The backend validates the ticket and attaches the authenticated user to the socket.
3. **Room assignment**
   - After validation, each socket joins a private room named by `userId`.
4. **Event lifecycle**
   - On new message: server emits `new_message`.
   - On video-analysis result: server emits `video_analysis_results<jobId>`.
   - On disconnect: the reason is logged and the client can reconnect with a refreshed ticket when needed.

### Current emitted events

| Event                           | Description                                                     |
| ------------------------------- | --------------------------------------------------------------- |
| `new_message`                   | Emitted when a new message is delivered to a user               |
| `video_analysis_results<jobId>` | Emitted when a video-analysis result arrives for a specific job |

### Scaling support

When `ENABLE_SOCKET_REDIS_ADAPTER=true`, Socket.IO can use Redis adapter clients for multi-instance broadcasting.

---

## DPoP (Proof-of-Possession) Overview

**Goal:** Bind JWTs to a client-held asymmetric key so that a stolen token alone is **not enough** to call the API.

- **Key:** Client keeps an **EC P‑256** key pair (ES256).
- **Binding at login:** Client sends a public-key thumbprint (`DPoP-Key-Binding`). The server embeds it as a confirmation claim in both tokens.
- **Per-request proof:** For protected routes (and for `/auth/refresh`), client sends a **DPoP** proof (compact JWS) in the `DPoP` header. The proof includes the HTTP method, absolute URL, issued-at, and the public JWK for verification.
- **Server checks:** Signature and header type; method and path equality; strict origin/path validation against server configuration; a short issued-at window; and JTI replay protection.
- **JTI blacklisting / replay prevention:** Uses Redis-backed caching to detect reuse and block replay attacks.

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
Built with **Node.js**, **TypeScript**, **Postgres**, **Redis**, **JWT (DPoP-bound)**, **Socket.IO**, **Zod**, **Pino**, and **Sentry**.  
It now also includes a **microservices-oriented video-analysis pipeline** with **AWS S3**, background workers, **Redis Pub/Sub**, and a dedicated **Python Computer Vision service**.  
Security: short-lived access tokens, atomic refresh rotation, DPoP proof-of-possession, bcrypt, rate limiting, structured validation, and request correlation.  
Quality: typed request/response contracts and broad integration test coverage.  
Performance and scalability: Redis caching, async workers, direct S3 uploads, and separation between API traffic and heavy media processing.  
Containerized, extensible, and much closer to production-grade than the earlier backend version.
