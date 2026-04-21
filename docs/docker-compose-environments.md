# Docker Compose Environments

The repo currently uses dedicated Compose files for local development and local tests.

## Available Compose Files

| File | Purpose |
| --- | --- |
| `docker-compose.development.yml` | Full local development stack |
| `docker-compose.test.yml` | Infra-only stack for tests |

## Development Compose

File: [`docker-compose.development.yml`](../docker-compose.development.yml)

This stack is meant for daily local work and includes both infra and app services.

### Services

| Service | Purpose | Host port |
| --- | --- | --- |
| `postgres_dev` | Local development Postgres | `5434` |
| `redis` | Redis cache / pubsub / Bull queues | `6379` |
| `redis-insight` | Redis UI | `5540` |
| `localstack` | Local S3 and SQS emulation | `4566` |
| `s3-explorer` | Local S3 browser UI | `8081` |
| `maildev` | Local email SMTP/UI | `1026`, `1081` |
| `atlas` | Migration runner container | none |
| `main-server` | Nest API in watch mode | `5000` |
| `background-workers` | Node workers in watch mode | none |
| `python-service` | Python video-analysis worker | none |

### Persistence

Development keeps state on disk:

- Postgres uses `pg_dev_data`
- Redis uses `redis_dev_data`
- RedisInsight uses `redisinsight_data`

That is intentional so your local work survives restarts.

## Test Compose

File: [`docker-compose.test.yml`](../docker-compose.test.yml)

This stack is intentionally smaller and only contains outer infrastructure.

### Services

| Service | Purpose | Host port |
| --- | --- | --- |
| `postgres_test` | Isolated test Postgres | `5433` |
| `redis_test` | Isolated test Redis | `6380` |
| `redis-insight_test` | Redis test UI | `5541` |
| `localstack_test` | Isolated LocalStack S3/SQS | `4567` |
| `maildev_test` | Isolated email SMTP/UI/API | `1025`, `1080` |
| `atlas` | Migration runner container | none |

### Why server/workers/python are not in test compose

Vitest boots the Nest app directly in the Node test process.

So for tests we only need the external dependencies to be real:

- Postgres
- Redis
- LocalStack
- Maildev

That keeps the test environment faster and easier to control.

### Persistence

The test stack is ephemeral by design:

- Postgres uses `tmpfs`
- Redis uses `tmpfs`
- LocalStack uses `tmpfs`
- RedisInsight test data uses `tmpfs`

This means test data is not supposed to survive the stack lifecycle.

## Shared Network

Both Compose files use the shared Docker network:

- `strong-together-shared`

That keeps the service naming stable for local orchestration.

## Related Scripts

| Script | Purpose |
| --- | --- |
| `npm run orch:dev` | Starts the development stack |
| `npm run test:env:up` | Starts the test infra stack |
| `npm run test:env:down` | Stops the test infra stack |

## LocalStack Notes

Both dev and test stacks mount:

- [`scripts/localstack/init-aws.sh`](../scripts/localstack/init-aws.sh)

That bootstrap script prepares the local AWS resources used by the app:

- S3 bucket
- profile-image S3 bucket
- SQS queue
- S3 notification wiring into SQS

This makes the video-analysis upload path and local profile-image storage work without touching real AWS or Supabase Storage.
