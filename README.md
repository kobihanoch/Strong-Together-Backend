# Strong Together Backend (v1.3.0)

**Strong Together** is a fitness-oriented application.  
This repository contains the backend server that powers the app.  
It exposes a REST API for user registration and authentication, workout planning and tracking, messaging, exercises, and push notifications.

The backend is built with **Node.js** and **Express**, uses **PostgreSQL** as its main database, **Redis** for caching, **Socket.IO** for realtime events, **JWT** for authentication, **Zod** for schema validation, and integrates with **Supabase Storage** and the **Expo push notification service**.

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

| Layer/Service           | Purpose/Notes                                                                                                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js / Express 5** | HTTP server and routing framework. Express 5 provides promise‑aware request handlers.                                                                                                                                                         |
| **PostgreSQL**          | Primary relational database. SQL queries live in `src/queries`. The code relies on Postgres views (e.g. `v_exercisetracking_expanded`) to assemble workout plans and analytics.                                                               |
| **Redis**               | Optional cache layer. When `CACHE_ENABLED=true`, workout plans and exercise tracking results are cached for 48h. Each user has a version number in Redis; whenever workout data changes the version is incremented to invalidate cached keys. |
| **Socket.IO**           | WebSockets server used to emit `new_message` events when system or user messages arrive. Clients join a room named after their user ID to receive targeted events.                                                                            |
| **Supabase Storage**    | Used for storing user profile pictures. Files are uploaded and retrieved via signed service‑role keys.                                                                                                                                        |
| **Expo Push service**   | Sends push notifications to users’ devices. The server exposes an example `/api/push/daily` endpoint that loops over tokens and calls Expo’s API.                                                                                             |
| **JWT**                 | Authentication with short‑lived access tokens (15 min) and long‑lived refresh tokens (30 days). Tokens signed with secrets from `.env`. A blacklist table stores revoked tokens to prevent reuse.                                             |
| **Docker & Compose**    | Dockerfile produces Node 20 image, `docker-compose.yml` maps port 5000 to host.                                                                                                                                                               |
| **Render Deployment**   | The backend is deployed on Render for hosting and scaling.                                                                                                                                                                                    |

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

| Middleware                          | Purpose                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| **cors**                            | Configured for any origin with credentials.                        |
| **cookie‑parser**                   | Parses cookies from incoming requests.                             |
| **express.json**                    | Parses JSON bodies.                                                |
| **helmet**                          | Adds security headers.                                             |
| **generalLimiter**                  | Rate‑limits (100 req/min/IP).                                      |
| **asyncHandler**                    | Wraps handlers, forwards errors.                                   |
| **authMiddleware (protect)**        | Verifies JWT, checks blacklist, attaches `req.user`.               |
| **roleMiddleware (authorizeRoles)** | Restricts routes by roles (e.g. admin, currently unused).          |
| **validateRequest**                 | Validates `req.body` with Zod schemas.                             |
| **uploadImage**                     | Handles multipart uploads (images ≤10 MB, only JPEG/JPG/PNG/WebP). |
| **errorHandler**                    | Central error handler with JSON responses.                         |

**Other Security Measures:**

- JWT rotation & blacklist (access short‑lived, refresh one‑time use).
- Password hashing with bcrypt (10 salt rounds).
- CORS + rate limiting enabled, trust proxy for real client IP.
- Input validation on all public endpoints (Zod).
- File upload filtering (image types only, max 10 MB).

---

## Caching

- Controlled by `CACHE_ENABLED`.
- Workout plan (`/api/workouts/getworkout`) cached under `{namespace}:{userId}:v{n}`. TTL: 48h.
- Exercise tracking (`/api/workouts/gettracking`) cached similarly.
- `X-Cache` response header shows `HIT` or `MISS`.

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

### Authentication

| Method | Endpoint        | Auth? | Body                                        | Description                                                                        |
| ------ | --------------- | ----- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| POST   | `/auth/login`   | No    | `{ username, password }`                    | Login, returns user + access/refresh tokens. Sends welcome message if first login. |
| POST   | `/auth/refresh` | No    | Header `x-refresh-token`                    | Sliding sessions: refresh token rotation.                                          |
| POST   | `/auth/logout`  | Yes   | Headers: `Authorization`, `x-refresh-token` | Blacklists tokens, clears push token.                                              |

### Users

| Method | Endpoint                  | Auth? | Body                                              | Description                                 |
| ------ | ------------------------- | ----- | ------------------------------------------------- | ------------------------------------------- |
| POST   | `/users/create`           | No    | `{ username, fullName, email, password, gender }` | Register new user.                          |
| GET    | `/users/get`              | Yes   | —                                                 | Get profile.                                |
| PUT    | `/users/update`           | Yes   | Optional fields                                   | Update user info.                           |
| PUT    | `/users/pushtoken`        | Yes   | `{ token }`                                       | Save Expo push token.                       |
| PUT    | `/users/setprofilepic`    | Yes   | multipart `file`                                  | Upload new profile pic. Stored in Supabase. |
| DELETE | `/users/deleteprofilepic` | Yes   | `{ path }`                                        | Delete profile pic from Supabase.           |

### Exercises

| Method | Endpoint            | Auth? | Description            |
| ------ | ------------------- | ----- | ---------------------- |
| GET    | `/exercises/getall` | Yes   | Returns all exercises. |

### Messages

| Method | Endpoint                   | Auth? | Params/Body | Description           |
| ------ | -------------------------- | ----- | ----------- | --------------------- |
| GET    | `/messages/getmessages`    | Yes   | —           | Get inbox messages.   |
| PUT    | `/messages/markasread/:id` | Yes   | URL `id`    | Mark message as read. |
| DELETE | `/messages/delete/:id`     | Yes   | URL `id`    | Delete message.       |

### Workouts

| Method | Endpoint                  | Auth? | Body                            | Description                             |
| ------ | ------------------------- | ----- | ------------------------------- | --------------------------------------- |
| GET    | `/workouts/getworkout`    | Yes   | —                               | Get active workout plan (cached).       |
| GET    | `/workouts/gettracking`   | Yes   | —                               | Get 45‑day exercise analytics (cached). |
| POST   | `/workouts/finishworkout` | Yes   | Array `workout`                 | Save completed workout.                 |
| DELETE | `/workouts/delete`        | Yes   | —                               | Delete workout plan.                    |
| POST   | `/workouts/add`           | Yes   | `{ workoutData, workoutName? }` | Create new workout plan.                |

### Push Notifications

| Method | Endpoint      | Auth? | Description               |
| ------ | ------------- | ----- | ------------------------- |
| GET    | `/push/daily` | No    | Sends test push via Expo. |

---

## Database Models & Indexes

- Uses **Postgres** with parameterised queries.
- Views: `v_exercisetoworkoutsplit_expanded`, `v_exercisetracking_expanded`.
- **Blacklist table** for revoked JWTs with TTL cleanup.
- Legacy Mongoose models exist but unused.
- Unique constraints on `username` and `email`.

---

## Database Schema

The backend uses PostgreSQL as its primary datastore. The schema
defines tables for users, messages, workout plans, splits, exercises
and tracking logs.

### Workout Flow

![Database workout flow](https://github.com/user-attachments/assets/e61c060e-222e-43b8-9819-aedf67963e15)

1. **Create a Plan** – A user creates a `WorkoutPlan`.
2. **Add Splits** – Each plan has multiple `WorkoutSplits`.
3. **Assign Exercises** – Exercises are mapped to splits with order and sets.

### Tracking Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/9ffa26e2-d762-465e-bbbd-28460373e0a7)

1. **Select a split** – User opens a split.
2. **Record Sets** – Weight/repetitions logged into `exercisetracking`.
3. **Review Progress** – Data aggregated for analytics.

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
