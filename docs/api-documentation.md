# API Documentation

This document is the contract-level reference for the current HTTP API exposed by the NestJS server.

It is intended to answer four things for every route:

1. what the endpoint does
2. which headers/guards apply
3. the complete request structure
4. the complete response structure

The request and response shapes below are aligned with the currently installed shared contract package used by the controllers: `@strong-together/shared@1.0.5`.

## Base URL And Transport

- Base path: `/`
- API namespace: `/api`
- Content type for JSON routes: `application/json`
- File upload route: `multipart/form-data`
- HTML callback routes: `text/html`

## Global Request Pipeline

Most routes are affected by the same global pipeline before controller logic runs.

| Layer | Purpose |
| --- | --- |
| `GeneralRateLimitMiddleware` | Coarse request throttling at the app edge |
| `RequestLoggerMiddleware` | Structured per-request logging and request ID context |
| `BotBlockerMiddleware` | Scanner and suspicious-client filtering |
| `CheckAppVersionMiddleware` | Enforces `x-app-version` unless the route is exempt |
| `ValidateRequestPipe` | Validates declared request schemas from `@strong-together/shared` |
| `RlsTxInterceptor` | Wraps most business routes in request-scoped DB execution |

## Authentication And Header Conventions

### Public routes

Public routes do not require a logged-in user.

### Authenticated user routes

Protected user routes typically require:

- `DpopGuard`
- `AuthenticationGuard`
- `AuthorizationGuard`
- `@Roles('user')`

When `DPOP_ENABLED=true`, clients should expect to send:

```http
Authorization: DPoP <access-token>
DPoP: <proof>
```

Some public login and refresh flows also use DPoP-related headers:

- login / OAuth can use `dpop-key-binding`
- refresh uses `DpopGuard`

### Common response headers

- `Cache-Control: no-store`
  Used on token-issuing and HTML callback flows.
- `X-Cache: HIT|MISS`
  Used on cache-backed read endpoints.

## Error Model

The app uses a global exception filter, request validation, and guards. That means failures generally fall into these buckets:

| Category | Typical status |
| --- | --- |
| Validation failure | `400` |
| Authentication / DPoP failure | `401` |
| Authorization failure | `403` |
| Not found | `404` |
| Rate limit | `429` |
| Unhandled server error | `500` |

This file focuses on success contracts. Route-specific non-JSON behavior is called out where relevant.

## Endpoint Index

| Method | Path | Access | Summary |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Liveness text |
| `GET` | `/health` | Public | Health check |
| `POST` | `/api/auth/login` | Public | Credential login |
| `POST` | `/api/auth/logout` | User | Logout current session |
| `POST` | `/api/auth/refresh` | Public | Rotate token pair |
| `POST` | `/api/auth/forgotpassemail` | Public | Send reset email |
| `PUT` | `/api/auth/resetpassword` | Public | Reset password from token |
| `GET` | `/api/auth/verify` | Public | Complete verification callback |
| `POST` | `/api/auth/sendverificationemail` | Public | Send verification email |
| `PUT` | `/api/auth/changeemailverify` | Public | Change email for unverified account |
| `GET` | `/api/auth/checkuserverify` | Public | Check verification state by username |
| `POST` | `/api/users/create` | Public | Create user account |
| `GET` | `/api/users/get` | User | Get current user profile |
| `PUT` | `/api/users/updateself` | User | Update current user profile |
| `GET` | `/api/users/changeemail` | Public | Complete email-change callback |
| `DELETE` | `/api/users/deleteself` | User | Delete current user |
| `PUT` | `/api/users/setprofilepic` | User | Upload profile image |
| `DELETE` | `/api/users/deleteprofilepic` | User | Delete profile image |
| `PUT` | `/api/users/pushtoken` | User | Save push token |
| `GET` | `/api/workouts/getworkout` | User | Get active workout plan |
| `POST` | `/api/workouts/add` | User | Create or replace workout plan |
| `GET` | `/api/workouts/gettracking` | User | Get workout tracking snapshot |
| `POST` | `/api/workouts/finishworkout` | User | Persist completed workout |
| `GET` | `/api/aerobics/get` | User | Get aerobics history |
| `POST` | `/api/aerobics/add` | User | Add aerobics record |
| `GET` | `/api/analytics/get` | User | Get analytics snapshot |
| `GET` | `/api/bootstrap/get` | User | Get client bootstrap payload |
| `GET` | `/api/exercises/getall` | User | Get exercise catalog |
| `GET` | `/api/messages/getmessages` | User | Get inbox |
| `PUT` | `/api/messages/markasread/:id` | User | Mark message as read |
| `DELETE` | `/api/messages/delete/:id` | User | Delete message |
| `POST` | `/api/oauth/apple` | Public | Apple OAuth login |
| `POST` | `/api/oauth/google` | Public | Google OAuth login |
| `GET` | `/api/push/daily` | Public | Trigger daily push enqueue |
| `GET` | `/api/push/hourlyreminder` | Public | Trigger hourly reminder enqueue |
| `POST` | `/api/videoanalysis/getpresignedurl` | User | Generate direct-upload URL |
| `POST` | `/api/ws/generateticket` | User | Generate websocket ticket |

## Core Routes

### `GET /`

Returns a plain text liveness string.

Response:

```text
Server is running...
```

### `GET /health`

Health probe route.

Response:

```json
{
  "status": "ok"
}
```

## Auth

### `POST /api/auth/login`

Authenticates a user with local credentials.

Access:

- Public
- Rate-limited by `RateLimitGuard`

Headers:

- `Content-Type: application/json`
- optional `dpop-key-binding: <jkt>`

Request body:

```json
{
  "identifier": "string",
  "password": "string"
}
```

Successful response:

```json
{
  "message": "string",
  "user": "string",
  "accessToken": "string",
  "refreshToken": "string"
}
```

Notes:

- The route returns `Cache-Control: no-store`.
- `user` is a string in the shared response contract, not an embedded user object.

### `POST /api/auth/logout`

Invalidates the authenticated user's current session.

Access:

- User

Request:

- no JSON body required
- authenticated session required

Successful response:

```json
{
  "message": "Logged out successfully"
}
```

### `POST /api/auth/refresh`

Rotates the access and refresh token pair using the submitted refresh token.

Access:

- Public
- `DpopGuard` protected

Request:

- no JSON body
- refresh token is expected by the server utility layer

Successful response:

```json
{
  "message": "string",
  "accessToken": "string",
  "refreshToken": "string",
  "userId": "string"
}
```

Notes:

- The route returns `Cache-Control: no-store`.

### `POST /api/auth/forgotpassemail`

Sends a password reset email when the submitted identifier maps to a user.

Access:

- Public
- Rate-limited

Request body:

```json
{
  "identifier": "string"
}
```

Successful response:

- Empty `200 OK` body

### `PUT /api/auth/resetpassword`

Resets a password using a token from the password-reset email.

Access:

- Public

Query:

```json
{
  "token": "string"
}
```

Request body:

```json
{
  "newPassword": "string"
}
```

Successful response:

```json
{
  "ok": true
}
```

### `GET /api/auth/verify`

Completes account verification from an email callback.

Access:

- Public

Query:

```json
{
  "token": "string"
}
```

Successful response:

- HTML page

Notes:

- Returns `text/html`
- Returns `Cache-Control: no-store`

### `POST /api/auth/sendverificationemail`

Sends a verification email for an existing email address when allowed.

Access:

- Public
- Rate-limited

Request body:

```json
{
  "email": "string"
}
```

Successful response:

- Empty `200 OK` body

### `PUT /api/auth/changeemailverify`

Changes the email address on an unverified account and sends a fresh verification email.

Access:

- Public
- Rate-limited

Request body:

```json
{
  "username": "string",
  "password": "string",
  "newEmail": "string"
}
```

Successful response:

- Empty `200 OK` body

### `GET /api/auth/checkuserverify`

Checks whether a username belongs to a verified account.

Access:

- Public

Query:

```json
{
  "username": "string"
}
```

Successful response:

```json
{
  "isVerified": true
}
```

## Users

### `POST /api/users/create`

Creates a new local user account.

Access:

- Public

Request body:

```json
{
  "username": "string",
  "fullName": "string",
  "email": "string",
  "password": "string",
  "gender": "Male"
}
```

Allowed `gender` values:

- `Male`
- `Female`
- `Other`
- `Unknown`

Successful response:

```json
{
  "message": "string",
  "user": {
    "id": "string",
    "username": "string",
    "name": "string",
    "email": "string | null",
    "gender": "string",
    "role": "string",
    "created_at": "string"
  }
}
```

Notes:

- Controller sets HTTP status `201 Created`.

### `GET /api/users/get`

Returns the authenticated user's persisted profile.

Access:

- User

Successful response:

```json
{
  "id": "string",
  "username": "string",
  "email": "string | null",
  "name": "string",
  "gender": "string",
  "created_at": "string",
  "profile_image_url": "string | null",
  "push_token": "string | null",
  "role": "string",
  "is_first_login": true,
  "token_version": 1,
  "is_verified": true,
  "auth_provider": "string"
}
```

### `PUT /api/users/updateself`

Updates editable profile fields for the authenticated user.

Access:

- User
- Rate-limited

Request body:

```json
{
  "username": "string",
  "fullName": "string",
  "email": "string"
}
```

Notes:

- All fields are optional in the shared request contract.
- When the submitted email changes, the backend can start an email verification flow.

Successful response:

```json
{
  "message": "string",
  "emailChanged": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string | null",
    "name": "string",
    "gender": "string",
    "created_at": "string",
    "profile_image_url": "string | null",
    "push_token": "string | null",
    "role": "string",
    "is_first_login": true,
    "token_version": 1,
    "is_verified": true,
    "auth_provider": "string"
  }
}
```

### `GET /api/users/changeemail`

Completes an email-change flow via signed token callback.

Access:

- Public

Query:

- `token=<signed-token>`

Successful response:

- HTML page

Notes:

- Returns `text/html`
- Returns `Cache-Control: no-store`

### `DELETE /api/users/deleteself`

Deletes the authenticated user's account.

Access:

- User

Successful response:

```json
{
  "message": "User deleted successfully"
}
```

### `PUT /api/users/setprofilepic`

Uploads a new profile picture and updates the stored profile image path.

Access:

- User

Headers:

- `Content-Type: multipart/form-data`

Multipart fields:

```text
file: binary image file
```

Successful response:

```json
{
  "path": "string",
  "url": "string",
  "message": "string"
}
```

Notes:

- Controller sets HTTP status `201 Created`.
- The route uses `FileInterceptor('file', imageUploadOptions)`.

### `DELETE /api/users/deleteprofilepic`

Deletes the authenticated user's profile image.

Access:

- User

Request body:

```json
{
  "path": "string"
}
```

Successful response:

- Empty `200 OK` body

### `PUT /api/users/pushtoken`

Stores or updates the authenticated user's push token.

Access:

- User

Request body:

```json
{
  "token": "string"
}
```

Successful response:

- Empty `200 OK` body

## Workouts

### Shared workout response building blocks

The plan and bootstrap endpoints reuse this workout plan shape:

```json
{
  "workoutPlan": {
    "id": 1,
    "name": "string",
    "numberofsplits": 4,
    "created_at": "string",
    "is_deleted": false,
    "level": "string",
    "user_id": "string",
    "trainer_id": "string",
    "is_active": true,
    "updated_at": "string",
    "workoutsplits": [
      {
        "id": 1,
        "workout_id": 1,
        "name": "string",
        "created_at": "string",
        "muscle_group": "string | null",
        "is_active": true,
        "exercisetoworkoutsplit": [
          {
            "id": 1,
            "sets": [8, 8, 6],
            "is_active": true,
            "targetmuscle": "string",
            "specifictargetmuscle": "string",
            "exercise": "string",
            "workoutsplit": "string"
          }
        ]
      }
    ]
  },
  "workoutPlanForEditWorkout": {
    "Push": [
      {
        "id": 10,
        "name": "Bench Press",
        "sets": [8, 8, 6],
        "order_index": 1,
        "targetmuscle": "Chest",
        "specifictargetmuscle": "Upper Chest"
      }
    ]
  }
}
```

### Shared tracking response building blocks

The tracking and bootstrap endpoints reuse this structure:

```json
{
  "exerciseTrackingAnalysis": {
    "unique_days": 12,
    "most_frequent_split": "Push",
    "most_frequent_split_days": 5,
    "lastWorkoutDate": "string | null",
    "splitDaysByName": {
      "Push": 5
    },
    "prs": {
      "pr_max": {
        "exercise": "Bench Press",
        "weight": 100,
        "reps": 5,
        "workout_time_utc": "string"
      }
    }
  },
  "exerciseTrackingMaps": {
    "byDate": {
      "2026-04-20": [
        {
          "id": 1,
          "exercisetosplit_id": 10,
          "weight": [100, 95, 90],
          "reps": [5, 6, 8],
          "notes": "string | null",
          "exercise_id": 20,
          "workoutsplit_id": 30,
          "splitname": "Push",
          "exercise": "Bench Press",
          "order_index": 1,
          "exercisetoworkoutsplit": {
            "sets": [5, 6, 8],
            "exercises": {
              "targetmuscle": "Chest",
              "specifictargetmuscle": "Upper Chest"
            }
          }
        }
      ]
    },
    "byETSId": {
      "10": [
        {
          "id": 1,
          "exercisetosplit_id": 10,
          "weight": [100, 95, 90],
          "reps": [5, 6, 8],
          "notes": "string | null",
          "exercise_id": 20,
          "workoutsplit_id": 30,
          "splitname": "Push",
          "exercise": "Bench Press",
          "workoutdate": "string",
          "order_index": 1,
          "exercisetoworkoutsplit": {
            "sets": [5, 6, 8],
            "exercises": {
              "targetmuscle": "Chest",
              "specifictargetmuscle": "Upper Chest"
            }
          }
        }
      ]
    },
    "bySplitName": {
      "Push": [
        {
          "id": 1,
          "exercisetosplit_id": 10,
          "weight": [100, 95, 90],
          "reps": [5, 6, 8],
          "notes": "string | null",
          "exercise_id": 20,
          "workoutsplit_id": 30,
          "exercise": "Bench Press",
          "workoutdate": "string",
          "order_index": 1,
          "exercisetoworkoutsplit": {
            "sets": [5, 6, 8],
            "exercises": {
              "targetmuscle": "Chest",
              "specifictargetmuscle": "Upper Chest"
            }
          }
        }
      ]
    }
  }
}
```

### `GET /api/workouts/getworkout`

Returns the current workout plan for the authenticated user.

Access:

- User

Query:

```json
{
  "tz": "string"
}
```

Successful response:

- Returns the full shared workout-plan shape shown above

Notes:

- Returns `X-Cache: HIT` or `X-Cache: MISS`

### `POST /api/workouts/add`

Creates or replaces the authenticated user's workout plan.

Access:

- User

Request body:

```json
{
  "workoutData": {
    "Push": [
      {
        "id": 10,
        "sets": [8, 8, 6],
        "order_index": 1
      }
    ]
  },
  "workoutName": "string",
  "tz": "string"
}
```

Successful response:

```json
{
  "message": "string",
  "workoutPlan": {
    "id": 1,
    "name": "string",
    "numberofsplits": 4,
    "created_at": "string",
    "is_deleted": false,
    "level": "string",
    "user_id": "string",
    "trainer_id": "string",
    "is_active": true,
    "updated_at": "string",
    "workoutsplits": [
      {
        "id": 1,
        "workout_id": 1,
        "name": "string",
        "created_at": "string",
        "muscle_group": "string | null",
        "is_active": true,
        "exercisetoworkoutsplit": [
          {
            "id": 1,
            "sets": [8, 8, 6],
            "is_active": true,
            "targetmuscle": "string",
            "specifictargetmuscle": "string",
            "exercise": "string",
            "workoutsplit": "string"
          }
        ]
      }
    ]
  },
  "workoutPlanForEditWorkout": {
    "Push": [
      {
        "id": 10,
        "name": "Bench Press",
        "sets": [8, 8, 6],
        "order_index": 1,
        "targetmuscle": "Chest",
        "specifictargetmuscle": "Upper Chest"
      }
    ]
  }
}
```

### `GET /api/workouts/gettracking`

Returns the authenticated user's recent tracking snapshot.

Access:

- User

Query:

```json
{
  "tz": "string"
}
```

Successful response:

- Returns the full shared tracking shape shown above

Notes:

- Returns `X-Cache: HIT` or `X-Cache: MISS`

### `POST /api/workouts/finishworkout`

Persists a completed workout and returns the updated tracking snapshot.

Access:

- User

Request body:

```json
{
  "workout": [
    {
      "exercisetosplit_id": 10,
      "weight": [100, 95, 90],
      "reps": [5, 6, 8],
      "notes": "string | null"
    }
  ],
  "tz": "string",
  "workout_start_utc": "string",
  "workout_end_utc": "string"
}
```

Successful response:

- Returns the full shared tracking shape shown above

## Aerobics

### `GET /api/aerobics/get`

Returns grouped aerobics history for the authenticated user.

Access:

- User

Query:

```json
{
  "tz": "string"
}
```

Successful response:

```json
{
  "daily": {
    "2026-04-20": [
      {
        "type": "string",
        "duration_sec": 1800,
        "duration_mins": 30
      }
    ]
  },
  "weekly": {
    "2026-W17": {
      "records": [
        {
          "type": "string",
          "duration_sec": 1800,
          "duration_mins": 30,
          "workout_time_utc": "string"
        }
      ],
      "total_duration_sec": 1800,
      "total_duration_mins": 30
    }
  }
}
```

Notes:

- Returns `X-Cache: HIT` or `X-Cache: MISS`

### `POST /api/aerobics/add`

Creates a new aerobics record and returns the refreshed aerobics snapshot.

Access:

- User

Request body:

```json
{
  "tz": "string",
  "record": {
    "durationMins": 30,
    "durationSec": 1800,
    "type": "string"
  }
}
```

Successful response:

- Returns the same `UserAerobicsResponse` structure shown above

## Analytics

### `GET /api/analytics/get`

Returns the current analytics snapshot for the authenticated user.

Access:

- User

Successful response:

```json
{
  "_1RM": {
    "Bench Press": {
      "exercise": "Bench Press",
      "pr_weight": 100,
      "pr_reps": 5,
      "max_1rm": 116.67
    }
  },
  "goals": {
    "Push": {
      "Bench Press": {
        "planned": 12,
        "actual": 10,
        "adherence_pct": 83.33
      }
    }
  }
}
```

Notes:

- Returns `X-Cache: HIT` or `X-Cache: MISS`

## Bootstrap

### `GET /api/bootstrap/get`

Returns the startup payload used by the client to hydrate the main app state.

Access:

- User

Query:

```json
{
  "tz": "string"
}
```

Successful response:

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string | null",
    "name": "string",
    "gender": "string",
    "created_at": "string",
    "profile_image_url": "string | null",
    "push_token": "string | null",
    "role": "string",
    "is_first_login": true,
    "token_version": 1,
    "is_verified": true,
    "auth_provider": "string"
  },
  "workout": {
    "workoutPlan": {
      "id": 1,
      "name": "string",
      "numberofsplits": 4,
      "created_at": "string",
      "is_deleted": false,
      "level": "string",
      "user_id": "string",
      "trainer_id": "string",
      "is_active": true,
      "updated_at": "string",
      "workoutsplits": [
        {
          "id": 1,
          "workout_id": 1,
          "name": "string",
          "created_at": "string",
          "muscle_group": "string | null",
          "is_active": true,
          "exercisetoworkoutsplit": [
            {
              "id": 1,
              "sets": [8, 8, 6],
              "is_active": true,
              "targetmuscle": "string",
              "specifictargetmuscle": "string",
              "exercise": "string",
              "workoutsplit": "string"
            }
          ]
        }
      ]
    },
    "workoutPlanForEditWorkout": {
      "Push": [
        {
          "id": 10,
          "name": "Bench Press",
          "sets": [8, 8, 6],
          "order_index": 1,
          "targetmuscle": "Chest",
          "specifictargetmuscle": "Upper Chest"
        }
      ]
    }
  },
  "tracking": {
    "exerciseTrackingAnalysis": {
      "unique_days": 12,
      "most_frequent_split": "Push",
      "most_frequent_split_days": 5,
      "lastWorkoutDate": "string | null",
      "splitDaysByName": {
        "Push": 5
      },
      "prs": {
        "pr_max": {
          "exercise": "Bench Press",
          "weight": 100,
          "reps": 5,
          "workout_time_utc": "string"
        }
      }
    },
    "exerciseTrackingMaps": {
      "byDate": {
        "2026-04-20": [
          {
            "id": 1,
            "exercisetosplit_id": 10,
            "weight": [100, 95, 90],
            "reps": [5, 6, 8],
            "notes": "string | null",
            "exercise_id": 20,
            "workoutsplit_id": 30,
            "splitname": "Push",
            "exercise": "Bench Press",
            "order_index": 1,
            "exercisetoworkoutsplit": {
              "sets": [5, 6, 8],
              "exercises": {
                "targetmuscle": "Chest",
                "specifictargetmuscle": "Upper Chest"
              }
            }
          }
        ]
      },
      "byETSId": {
        "10": [
          {
            "id": 1,
            "exercisetosplit_id": 10,
            "weight": [100, 95, 90],
            "reps": [5, 6, 8],
            "notes": "string | null",
            "exercise_id": 20,
            "workoutsplit_id": 30,
            "splitname": "Push",
            "exercise": "Bench Press",
            "workoutdate": "string",
            "order_index": 1,
            "exercisetoworkoutsplit": {
              "sets": [5, 6, 8],
              "exercises": {
                "targetmuscle": "Chest",
                "specifictargetmuscle": "Upper Chest"
              }
            }
          }
        ]
      },
      "bySplitName": {
        "Push": [
          {
            "id": 1,
            "exercisetosplit_id": 10,
            "weight": [100, 95, 90],
            "reps": [5, 6, 8],
            "notes": "string | null",
            "exercise_id": 20,
            "workoutsplit_id": 30,
            "exercise": "Bench Press",
            "workoutdate": "string",
            "order_index": 1,
            "exercisetoworkoutsplit": {
              "sets": [5, 6, 8],
              "exercises": {
                "targetmuscle": "Chest",
                "specifictargetmuscle": "Upper Chest"
              }
            }
          }
        ]
      }
    }
  },
  "messages": {
    "messages": [
      {
        "id": "string",
        "subject": "string",
        "msg": "string",
        "sent_at": "string",
        "is_read": true,
        "sender_full_name": "string",
        "sender_profile_image_url": "string | null"
      }
    ]
  },
  "aerobics": {
    "daily": {
      "2026-04-20": [
        {
          "type": "string",
          "duration_sec": 1800,
          "duration_mins": 30
        }
      ]
    },
    "weekly": {
      "2026-W17": {
        "records": [
          {
            "type": "string",
            "duration_sec": 1800,
            "duration_mins": 30,
            "workout_time_utc": "string"
          }
        ],
        "total_duration_sec": 1800,
        "total_duration_mins": 30
      }
    }
  }
}
```

## Exercises

### `GET /api/exercises/getall`

Returns the exercise catalog grouped by key.

Access:

- User

Successful response:

```json
{
  "Chest": [
    {
      "id": 1,
      "name": "Bench Press",
      "specificTargetMuscle": "Upper Chest"
    }
  ]
}
```

## Messages

### `GET /api/messages/getmessages`

Returns the authenticated user's inbox.

Access:

- User

Query:

```json
{
  "tz": "string"
}
```

Successful response:

```json
{
  "messages": [
    {
      "id": "string",
      "subject": "string",
      "msg": "string",
      "sent_at": "string",
      "is_read": true,
      "sender_full_name": "string",
      "sender_profile_image_url": "string | null"
    }
  ]
}
```

### `PUT /api/messages/markasread/:id`

Marks a message as read.

Access:

- User

Path params:

```json
{
  "id": "string"
}
```

Successful response:

```json
{
  "id": "string",
  "is_read": true
}
```

### `DELETE /api/messages/delete/:id`

Deletes a message from the user's inbox.

Access:

- User

Path params:

```json
{
  "id": "string"
}
```

Successful response:

```json
{
  "id": "string"
}
```

## OAuth

### `POST /api/oauth/apple`

Authenticates or creates a user through Apple sign-in.

Access:

- Public
- Rate-limited

Headers:

- `Content-Type: application/json`
- optional `dpop-key-binding: <jkt>`

Request body:

```json
{
  "idToken": "string",
  "rawNonce": "string",
  "name": {
    "givenName": "string | null",
    "familyName": "string | null"
  },
  "email": "string | null"
}
```

Successful response:

```json
{
  "message": "string",
  "user": "string",
  "accessToken": "string",
  "refreshToken": "string | null",
  "missingFields": ["string"] 
}
```

Notes:

- Returns `Cache-Control: no-store`
- `missingFields` is present in the shared response contract for profile completion flows

### `POST /api/oauth/google`

Authenticates or creates a user through Google sign-in.

Access:

- Public
- Rate-limited

Headers:

- `Content-Type: application/json`
- optional `dpop-key-binding: <jkt>`

Request body:

```json
{
  "idToken": "string"
}
```

Successful response:

```json
{
  "message": "string",
  "user": "string",
  "accessToken": "string",
  "refreshToken": "string | null",
  "missingFields": ["string"]
}
```

Notes:

- Returns `Cache-Control: no-store`

## Push

### `GET /api/push/daily`

Triggers the daily push enqueue flow.

Access:

- Public

Successful response:

```json
{
  "success": true,
  "message": "string"
}
```

Failure shape:

```json
{
  "success": false,
  "error": "string"
}
```

### `GET /api/push/hourlyreminder`

Triggers the hourly reminder enqueue flow.

Access:

- Public

Successful response:

```json
{
  "success": true,
  "message": "string"
}
```

Failure shape:

```json
{
  "success": false,
  "error": "string"
}
```

## Video Analysis

### `POST /api/videoanalysis/getpresignedurl`

Generates a presigned S3 upload URL for video-analysis ingestion.

Access:

- User

Headers:

- `Content-Type: application/json`
- optional tracing headers: `sentry-trace`, `baggage`

Request body:

```json
{
  "exercise": "string",
  "fileType": "string",
  "jobId": "string"
}
```

Successful response:

```json
{
  "uploadUrl": "string",
  "fileKey": "string",
  "requestId": "string"
}
```

## WebSockets

### `POST /api/ws/generateticket`

Generates a short-lived websocket ticket for the authenticated user.

Access:

- User

Request body:

```json
{
  "username": "string"
}
```

Successful response:

```json
{
  "ticket": "string"
}
```

Notes:

- Controller sets HTTP status `201 Created`.

## Operational Notes

### Cache-backed routes

These routes return `X-Cache: HIT` or `X-Cache: MISS`:

- `/api/workouts/getworkout`
- `/api/workouts/gettracking`
- `/api/aerobics/get`
- `/api/analytics/get`

### HTML routes

These routes do not return JSON:

- `/api/auth/verify`
- `/api/users/changeemail`

### Infra-coupled routes

These routes touch external infrastructure directly:

- `/api/videoanalysis/getpresignedurl` uses S3 presigning
- `/api/push/daily` and `/api/push/hourlyreminder` enqueue background work
- auth mail flows rely on mailer / queue infrastructure
- profile image routes use object storage through `SupabaseStorageService`; prod uses Supabase Storage, dev/test use LocalStack S3

### Source Of Truth

This document was aligned against:

- route controllers in `src/modules/**`
- root routes in `src/app.ts`
- shared request / response contracts in `node_modules/@strong-together/shared/dist/index.d.ts`
