# Strong Together Backend (v3.0.0)

This is the **microservices-based backend** for **Strong Together**.

- Backend repository: [Strong-Together-Backend](https://github.com/kobihanoch/Strong-Together-Backend)
- Frontend repository: [Strong-Together-App](https://github.com/kobihanoch/Strong-Together-App)

It powers authentication, workout planning, progress tracking, realtime messaging, push notifications, and asynchronous exercise video analysis.
The project combines a TypeScript API, background workers, Redis-based async infrastructure, a Python computer-vision service, and a PostgreSQL schema designed for analytics-heavy fitness flows.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FF6F00?style=for-the-badge&logo=google&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=typescript&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![Pino](https://img.shields.io/badge/Pino-FFD43B?style=for-the-badge&logo=javascript&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## TL;DR

A backend platform with:

- async video processing using **Node.js**, **Python**, **Redis**, and **AWS S3**
- secure authentication using **JWT**, **DPoP**, and **rate limits**
- realtime communication using **Socket.IO**
- a PostgreSQL schema designed for workout tracking, analytics, and reminders

## Highlights

- **Microservices architecture**: a **TypeScript REST API**, **background workers**, **Redis queues / Pub/Sub**, **WebSockets**, and a dedicated **Python computer-vision microservice**.
- **Authentication and request protection**: **JWT**, **DPoP proof-of-possession**, **rate limits**, bot blocking, token rotation, and strict request validation.
- **Request contracts**: **Zod schemas** are used to validate request payloads at the API boundary before controller logic runs.
- **Async media pipeline**: **direct AWS S3 uploads**, queued jobs, Python-based CV analysis, and **realtime result delivery** back to the client.
- **Database design**: **PostgreSQL**, analytics views, normalized workout tracking, reminder intelligence, indexing strategy, and **RLS-aware** patterns.
- **Test coverage**: **Vitest + Supertest** integration tests across auth, workouts, analytics, OAuth, websockets, and video analysis.
- **Observability**: **Pino structured logs**, **Sentry tracing**, request IDs, and service-aware error handling.

## Quick Links

- [TL;DR](#tldr)
- [Highlights](#highlights)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Middleware and Security Layer](#middleware-and-security-layer)
- [Docker Setup](#docker-setup)
- [API Overview](#api-overview)
- [Database Overview](#database-overview)
- [Run Locally](#run-locally)
- [Testing](#testing)
- [Schema SQL](./schema.sql)
- [Seed SQL](./seed.sql)
- [Exercises Seed](./exercises_seed.sql)
- [Docker Compose](./docker-compose.yml)

## Table of Contents

1. [TL;DR](#tldr)
2. [Highlights](#highlights)
3. [Quick Links](#quick-links)
4. [Architecture](#architecture)
   1. [Video Analysis Architecture](#video-analysis-architecture)
5. [Tech Stack](#tech-stack)
6. [Middleware and Security Layer](#middleware-and-security-layer)
   1. [Core middlewares](#core-middlewares)
   2. [Why it matters](#why-it-matters)
7. [Run Locally](#run-locally)
   1. [Docker setup](#docker-setup)
8. [Testing](#testing)
9. [API Overview](#api-overview)
   1. [Main domains](#main-domains)
   2. [API characteristics](#api-characteristics)
10. [Database Overview](#database-overview)
11. [Key database design choices](#key-database-design-choices)
12. [Important tables and objects](#important-tables-and-objects)
13. [DB files](#db-files)
14. [Database Schema](#database-schema)
15. [Workout tracking model](#workout-tracking-model)
16. [Database Flows](#database-flows)
17. [Workout Flow](#workout-flow)
18. [Tracking Flow](#tracking-flow)
19. [Messages Flow](#messages-flow)
20. [Auth Flow](#auth-flow)
21. [Reminder Flow](#reminder-flow)

## Architecture

**Video analysis flow:** Client → Node API (get presigned URL) → S3 (upload) → Redis queue → Python service (analysis) → Redis Pub/Sub → Node → Socket.IO → Client

This flow ensures that heavy video processing does not block the API and allows the analysis service to scale independently from the request layer.
The tradeoff is additional operational complexity: more moving parts, cross-service coordination, and more infrastructure to monitor compared with a single-process design.

- `src/` contains the main Express API, validation, business logic, integrations, and realtime publishing.
- `workers/` handles background jobs such as emails, push notifications, and video-analysis dispatching.
- `pythonService/` is a separate FastAPI-based computer-vision service for exercise video processing.
- `tests/` contains integration suites that validate real backend flows end-to-end.

### Video Analysis Architecture

![Video analysis architecture](https://github.com/user-attachments/assets/e8c8d6fc-1d50-4adb-98f3-701bb570c069)

## Tech Stack

| Layer                | Main Tools                         |
| -------------------- | ---------------------------------- |
| API                  | Node.js, Express 5, TypeScript     |
| Database             | PostgreSQL                         |
| Async infrastructure | Redis, Bull, Pub/Sub               |
| Realtime             | Socket.IO                          |
| Storage              | AWS S3, Supabase Storage           |
| Auth & validation    | JWT, DPoP, Zod, bcrypt             |
| Notifications        | Expo Push, Resend                  |
| Observability        | Pino, Sentry                       |
| Testing              | Vitest, Supertest                  |
| Video analysis       | Python, FastAPI, OpenCV, MediaPipe |

Redis is used for queues and Pub/Sub so heavy workloads can be processed asynchronously instead of blocking the API request cycle.
Socket.IO is used to push analysis results and other realtime events back to the client without polling.
PostgreSQL holds both operational data and analytics-oriented structures such as views, indexes, and reminder-related tables.

## Middleware and Security Layer

The request pipeline is structured through layered middleware to handle security, validation, and request lifecycle concerns.

### Core middlewares

| Middleware                  | Role in the system                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `express.json()`            | Parses JSON request bodies for the API layer                                           |
| `cors()`                    | Restricts allowed origins and request metadata                                         |
| `helmet()`                  | Applies hardened HTTP security headers                                                 |
| `generalLimiter`            | Applies general request rate limiting                                                  |
| `botBlocker`                | Blocks malicious bot and scanner traffic patterns                                      |
| `checkAppVersion`           | Enforces minimum supported mobile app versions                                         |
| request logger + request ID | Attaches correlation metadata for logs and tracing                                     |
| `dpopValidationMiddleware`  | Verifies DPoP proofs including signature, request binding, and replay-sensitive fields |
| `protect`                   | Validates JWT access tokens and authenticated user context                             |
| `validate(...)`             | Enforces request contract validation with Zod                                          |
| `withRlsTx(...)`            | Wraps handlers in a transaction-aware DB execution flow aligned with RLS patterns      |
| `asyncHandler`              | Centralizes async error forwarding for route handlers                                  |
| `errorHandler`              | Standardizes API error responses at the edge                                           |

### Why it matters

- **Security is enforced before business logic**: authentication, DPoP verification, **rate limits**, bot filtering, and version checks all happen at the request boundary.
- **Validation is explicit**: route inputs are validated with Zod before controller execution, which makes request contracts clearer and safer.
- **Database access is controlled**: protected flows are executed through `withRlsTx(...)`, giving the backend a clean bridge between API identity and DB-level authorization patterns.
- **Operational debugging is easier**: request IDs, structured logs, and Sentry context make production issues significantly easier to trace.

## Run Locally

### Docker setup

The repository includes multiple Docker entry points to match both the current deployment model and future service separation.

- The root `Dockerfile` is the main container currently used on **Render**. It runs `start.sh`, which starts both the **Node API** and the **background workers** inside the same VM.
- Separate Dockerfiles also exist for `src/Dockerfile` and `workers/Dockerfile`. They are kept to support a more modular deployment model where the API and workers can be split into independent services later.
- `pythonService/Dockerfile` is dedicated to the computer-vision service and is intended to run as a **private service** on Render.

This setup keeps the current deployment simple while leaving room to separate services further as operational needs grow.

1. Create `.env` with the required infrastructure secrets and URLs:

```env
NODE_ENV=
DPOP_ENABLED=
CACHE_ENABLED=
MIN_APP_VERSION=

# Sentry
SENTRY_DSN=
SENTRY_ENVIRONMENT=
SENTRY_RELEASE=
SENTRY_TRACES_SAMPLE_RATE=
SENTRY_PROFILES_SAMPLE_RATE=

# DB
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=
BUCKET_NAME=

# Secrets
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_VERIFY_SECRET=
JWT_FORGOT_PASSWORD_SECRET=
JWT_SOCKET_SECRET=
CHANGE_EMAIL_SECRET=

# Redis
ENABLE_SOCKET_REDIS_ADAPTER=
REDIS_URL=
REDIS_USERNAME=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# URLS
PUBLIC_BASE_URL=
PUBLIC_BASE_URL_RENDER_DEFAULT=
PRIVATE_BASE_URL_DEV=

# Apple
APPLE_ALLOWED_AUDS=

# Cache TTLS
CACHE_TTL_TRACKING_SEC=
CACHE_TTL_PLAN_SEC=
CACHE_TTL_AEROBICS_SEC=
CACHE_TTL_ANALYTICS_SEC=

# Resend (mailer)
RESEND_API_KEY=

# Constants
SYSTEM_USER_ID=

# Python service
ANALYSIS_SERVER_URL=

```

2. Install dependencies and start the API:

```bash
npm install
npm run start:server
```

3. Start background workers:

```bash
npm run start:workers
```

4. Or run the stack with Docker:

```bash
docker compose up --build
```

## Testing

The project includes integration tests for the main product flows:

- Authentication
- Users
- Workouts
- Bootstrap
- Messages
- Aerobics
- Analytics
- Exercises
- OAuth
- Video analysis
- WebSockets

Useful commands:

```bash
npm run test:db:reset
npm run test:all
```

You can also run domain-specific suites such as `npm run test:auth`, `npm run test:workouts`, or `npm run test:videoanalysis`.

## API Overview

Base path: `/api`

### Main domains

| Domain         | Key endpoints                                                                               |
| -------------- | ------------------------------------------------------------------------------------------- |
| Auth           | `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/verify`                              |
| Users          | `/users/create`, `/users/get`, `/users/updateself`, `/users/deleteself`                     |
| OAuth          | `/oauth/google`, `/oauth/apple`, `/oauth/proceedauth`                                       |
| Workouts       | `/workouts/getworkout`, `/workouts/gettracking`, `/workouts/finishworkout`, `/workouts/add` |
| Messages       | `/messages/getmessages`, `/messages/markasread/:id`, `/messages/delete/:id`                 |
| Exercises      | `/exercises/getall`                                                                         |
| Analytics      | `/analytics/get`                                                                            |
| Bootstrap      | `/bootstrap/get`                                                                            |
| Aerobics       | `/aerobics/get`, `/aerobics/add`                                                            |
| Push           | `/push/daily`, `/push/hourlyreminder`                                                       |
| WebSocket      | `/ws/generateticket`                                                                        |
| Video Analysis | `/videoanalysis/getpresignedurl`, `/videoanalysis/publishjob`                               |

### API characteristics

- Protected routes use DPoP-aware authentication when enabled.
- Request validation is enforced with Zod.
- WebSocket access is gated through a signed connection ticket.
- Heavy media work is offloaded from the API thread into workers and the Python service.

## Database Overview

PostgreSQL is the system of record. The schema is used not only for storage, but also for workout modeling, analytics-oriented views, reminder-related computation, and access-control-aware query design.

### Key database design choices

- **Normalized workout tracking**: workout timing lives in `workout_summary`, while set-level records point to it through `workout_summary_id`.
- **Analytics-friendly views**: views such as `v_exercisetracking_expanded` rebuild rich workout history without duplicating business logic in the API layer.
- **Reminder intelligence**: `user_split_information` and `user_reminder_settings` support personalized workout reminders based on actual training behavior.
- **Retention housekeeping**: `housekeeping_compact_old_workouts()` keeps workout history compact based on workout-day boundaries.
- **Indexing for real usage**: the schema includes targeted indexes for reminders, tracking lookups, and workout time queries.
- **Security-aware DB design**: the exported schema includes Row Level Security policies for user-owned data.

### Important tables and objects

| Object                                                    | Purpose                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| `users`                                                   | user identity, profile data, and session versioning          |
| `messages`                                                | inbox-style system/user messaging                            |
| `workoutplans`, `workoutsplits`, `exercisetoworkoutsplit` | workout-program structure                                    |
| `workout_summary`                                         | authoritative workout start/end window per completed workout |
| `exercisetracking`                                        | set-by-set execution records linked to `workout_summary`     |
| `aerobictracking`                                         | cardio / aerobic activity tracking                           |
| `user_reminder_settings`                                  | reminder preferences per user                                |
| `user_split_information`                                  | inferred preferred split timing and weekday                  |
| `v_exercisetracking_expanded`, `v_prs`                    | reporting and analytics views                                |

### DB files

- Full schema: [schema.sql](./schema.sql)
- Base seed data: [seed.sql](./seed.sql)
- Exercise seed data: [exercises_seed.sql](./exercises_seed.sql)

### Database Schema

![Database schema overview](https://github.com/user-attachments/assets/9e518921-8f86-4882-8d05-96bbbd0c8d47)

### Workout tracking model

1. A completed workout creates a row in `workout_summary`.
2. Each tracked set is written into `exercisetracking` with a `workout_summary_id`.
3. Analytics queries read from views that join tracking data back to the workout summary.
4. Reminder and housekeeping jobs rely on that normalized structure instead of duplicated timestamps.

## Database Flows

### Workout Flow

![Database workout flow](https://github.com/user-attachments/assets/7a634d62-9c30-4546-b24e-46df64781a6a)

1. A user creates or updates a workout plan.
2. Splits are stored in `workoutsplits`.
3. Exercises are attached through `exercisetoworkoutsplit`.
4. Reminder metadata can later be derived from actual user activity.

### Tracking Flow

![Database tracking flow](https://github.com/user-attachments/assets/be800fc7-5411-40f5-9740-2395af151f08)

1. Finishing a workout creates a `workout_summary` row.
2. Each performed set is saved in `exercisetracking`.
3. Analytics views join tracking rows back to `workout_summary`.
4. Retention logic works on workout-day boundaries rather than per-set timestamps.

### Messages Flow

![Database messages flow](https://github.com/user-attachments/assets/9a87b874-be46-403e-bfbc-c3709175767f)

1. The system creates a message.
2. The user fetches and reads it.
3. The message can be deleted from the user-facing inbox flow.

### Auth Flow

![Database auth flow](https://github.com/user-attachments/assets/eb0c0c2a-84bc-4409-9b7a-b7019c1ebd27)

1. The user authenticates with credentials or OAuth.
2. The backend issues access and refresh tokens.
3. Protected requests can be bound to DPoP proofs.
4. Session invalidation is handled through token versioning.

### Reminder Flow

![Reminder flow](https://github.com/user-attachments/assets/39a0c9fb-aba8-4e27-8c6d-2568167e546c)

1. `refresh_user_split_information()` computes reminder timing from training history.
2. The backend reads reminder settings and upcoming split timing.
3. Push notifications are queued and delivered to the user device.
