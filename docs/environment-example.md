# Environment Example

This document shows the environment variables expected by the backend using **placeholder values only**. Do not paste real secrets, production credentials, private keys, database passwords, or provider tokens into documentation.

The application loads environment files by `NODE_ENV`:

```text
NODE_ENV=development -> .env.development
NODE_ENV=test        -> .env.test
NODE_ENV=production  -> .env.production
```

## Development Template

Use this as a safe reference for local development. Replace the placeholder values with local-only values.

```bash
# Runtime
NODE_ENV=development
PORT=5000
PUBLIC_BASE_URL=http://localhost:5000
PUBLIC_BASE_URL_RENDER_DEFAULT=https://your-render-service.example.com
PRIVATE_BASE_URL_DEV=http://localhost:5000
MIN_APP_VERSION=0.0.0
SYSTEM_USER_ID=00000000-0000-0000-0000-000000000000

# Feature flags
DPOP_ENABLED=false
CACHE_ENABLED=true
ENABLE_SOCKET_REDIS_ADAPTER=true

# Database
DATABASE_URL=postgres://postgres:postgres@postgres_dev:5432/strongtogether_dev

# JWT and auth secrets
JWT_ACCESS_SECRET=replace-with-local-access-secret
JWT_REFRESH_SECRET=replace-with-local-refresh-secret
JWT_VERIFY_SECRET=replace-with-local-verify-secret
JWT_FORGOT_PASSWORD_SECRET=replace-with-local-forgot-password-secret
CHANGE_EMAIL_SECRET=replace-with-local-change-email-secret
JWT_SOCKET_SECRET=replace-with-local-socket-secret
APPLE_ALLOWED_AUDS=com.example.ios,com.example.service

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379
REDIS_USERNAME=
REDIS_PASSWORD=

# Cache TTLs, in seconds
CACHE_TTL_TRACKING_SEC=172800
CACHE_TTL_TIMEZONE_SEC=172800
CACHE_TTL_PLAN_SEC=172800
CACHE_TTL_ANALYTICS_SEC=3600
CACHE_TTL_AEROBICS_SEC=172800

# LocalStack / AWS-compatible storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_BUCKET_NAME=strong-together-videos-dev
AWS_S3_ENDPOINT_URL=http://localstack:4566
AWS_S3_PRESIGN_ENDPOINT_URL=http://localhost:4566
AWS_SQS_ENDPOINT_URL=http://localstack:4566
AWS_ANALYSIS_SQS_QUEUE_URL=http://localstack:4566/000000000000/video-analysis-queue

# Supabase-compatible profile storage
SUPABASE_URL=http://localstack:4566
SUPABASE_SERVICE_ROLE=replace-with-local-placeholder
BUCKET_NAME=strong-together-profile-images-dev

# Email
RESEND_API_KEY=replace-with-production-only-key
MAILDEV_API_URL=http://maildev:1080
MAILDEV_SMTP_HOST=maildev
MAILDEV_SMTP_PORT=1025

# Observability
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
SENTRY_RELEASE=local
SENTRY_TRACES_SAMPLE_RATE=0
SENTRY_PROFILES_SAMPLE_RATE=0
LOG_SERVICE_NAME=strong-together-server
LOG_LEVEL=debug

# Python video-analysis service
ENABLE_DEBUG_WINDOW=0
```

## Test Template

The test environment uses isolated infrastructure and different ports. Values below are placeholders for local tests only.

```bash
NODE_ENV=test
PORT=5001
PUBLIC_BASE_URL=http://localhost:5001
MIN_APP_VERSION=0.0.0
SYSTEM_USER_ID=00000000-0000-0000-0000-000000000000

DPOP_ENABLED=false
CACHE_ENABLED=true
ENABLE_SOCKET_REDIS_ADAPTER=true

DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/strongtogether_test

JWT_ACCESS_SECRET=replace-with-test-access-secret
JWT_REFRESH_SECRET=replace-with-test-refresh-secret
JWT_VERIFY_SECRET=replace-with-test-verify-secret
JWT_FORGOT_PASSWORD_SECRET=replace-with-test-forgot-password-secret
CHANGE_EMAIL_SECRET=replace-with-test-change-email-secret
JWT_SOCKET_SECRET=replace-with-test-socket-secret
APPLE_ALLOWED_AUDS=com.example.test

REDIS_HOST=127.0.0.1
REDIS_PORT=6380
REDIS_URL=redis://127.0.0.1:6380

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_BUCKET_NAME=strong-together-videos-test
AWS_S3_ENDPOINT_URL=http://127.0.0.1:4567
AWS_S3_PRESIGN_ENDPOINT_URL=http://127.0.0.1:4567
AWS_SQS_ENDPOINT_URL=http://127.0.0.1:4567
AWS_ANALYSIS_SQS_QUEUE_URL=http://127.0.0.1:4567/000000000000/video-analysis-queue

SUPABASE_URL=http://127.0.0.1:4567
SUPABASE_SERVICE_ROLE=replace-with-test-placeholder
BUCKET_NAME=strong-together-profile-images-test

MAILDEV_API_URL=http://127.0.0.1:1080
MAILDEV_SMTP_HOST=127.0.0.1
MAILDEV_SMTP_PORT=1025

SENTRY_DSN=
SENTRY_ENVIRONMENT=test
SENTRY_RELEASE=test
SENTRY_TRACES_SAMPLE_RATE=0
SENTRY_PROFILES_SAMPLE_RATE=0
LOG_LEVEL=silent
ENABLE_DEBUG_WINDOW=0
```

## Production Notes

Production values should be configured in the deployment provider, not copied into the repository.

For production, use real provider values for:

- **`DATABASE_URL`**
- **JWT secrets**
- **`RESEND_API_KEY`**
- **AWS credentials and endpoints**
- **`SENTRY_DSN`**
- **`PUBLIC_BASE_URL`**
- **`SYSTEM_USER_ID`**

Production secrets should be generated uniquely per environment. Do not reuse local or test secrets in production.

## Variable Groups

| Group | Variables |
| --- | --- |
| Runtime | `NODE_ENV`, `PORT`, `PUBLIC_BASE_URL`, `PUBLIC_BASE_URL_RENDER_DEFAULT`, `PRIVATE_BASE_URL_DEV`, `MIN_APP_VERSION`, `SYSTEM_USER_ID` |
| Feature flags | `DPOP_ENABLED`, `CACHE_ENABLED`, `ENABLE_SOCKET_REDIS_ADAPTER` |
| Database | `DATABASE_URL`, `PROD_DATABASE_URL` |
| Auth | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_VERIFY_SECRET`, `JWT_FORGOT_PASSWORD_SECRET`, `CHANGE_EMAIL_SECRET`, `JWT_SOCKET_SECRET`, `APPLE_ALLOWED_AUDS` |
| Redis | `REDIS_HOST`, `REDIS_PORT`, `REDIS_URL`, `REDIS_USERNAME`, `REDIS_PASSWORD` |
| Cache TTLs | `CACHE_TTL_TRACKING_SEC`, `CACHE_TTL_TIMEZONE_SEC`, `CACHE_TTL_PLAN_SEC`, `CACHE_TTL_ANALYTICS_SEC`, `CACHE_TTL_AEROBICS_SEC` |
| AWS / LocalStack | `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_S3_ENDPOINT_URL`, `AWS_S3_PRESIGN_ENDPOINT_URL`, `AWS_SQS_ENDPOINT_URL`, `AWS_ANALYSIS_SQS_QUEUE_URL` |
| Supabase-compatible storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`, `BUCKET_NAME` |
| Email | `RESEND_API_KEY`, `MAILDEV_API_URL`, `MAILDEV_SMTP_HOST`, `MAILDEV_SMTP_PORT` |
| Observability | `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_PROFILES_SAMPLE_RATE`, `LOG_SERVICE_NAME`, `LOG_LEVEL` |
| Python service | `ENABLE_DEBUG_WINDOW` |

## Safety Rules

- Keep real secrets out of Markdown files.
- Keep production secrets in the deployment provider or secret manager.
- Use different JWT secrets for development, test, and production.
- Treat `PROD_DATABASE_URL`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE`, AWS credentials, and Sentry DSNs as sensitive.
- Rotate secrets if they were ever committed or shared accidentally.
