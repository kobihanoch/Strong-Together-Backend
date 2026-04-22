# Video Analysis Pipeline

![Video Pipeline Diagram](https://github.com/user-attachments/assets/62af4f0e-5dd1-45bc-8334-712721f92990)

The video-analysis system is designed around direct upload, asynchronous processing, and realtime result delivery.

## End-To-End Flow

1. The mobile client calls `POST /api/videoanalysis/getpresignedurl`.
2. `VideoAnalysisController` validates the request with `getPresignedUrlS3Request` from `@strong-together/shared`.
3. `DpopGuard`, `AuthenticationGuard`, `AuthorizationGuard`, and `RlsTxInterceptor` protect the route.
4. `VideoAnalysisService` creates a file key using `exercise`, `userId`, and timestamp.
5. The API generates a presigned S3 upload URL and attaches metadata:
   - `job_id`
   - `request_id`
   - `user_id`
   - `exercise`
   - `sentry_trace`
   - `baggage`
6. The client uploads the video directly to S3.
7. S3 emits an `ObjectCreated` event to SQS.
8. The Python worker long-polls SQS.
9. The worker downloads the video, continues the Sentry trace when possible, analyzes the exercise, publishes a result to Redis, deletes the source video, and then deletes the SQS message.
10. `VideoAnalysisSubscriber` receives the Redis message and emits `video_analysis_results` to the user over Socket.IO.

In shorthand, the as-built path is:

```text
S3 -> SQS -> Python worker -> Redis Pub/Sub -> Nest subscriber -> Socket.IO
```

The database participates in the protected API boundary before upload URL creation through authentication, token version checks, and RLS-aware user context. The current worker implementation does not persist analysis output directly to Postgres; result delivery is realtime-first. If historical analysis storage is added later, the natural insertion point is after worker analysis succeeds and before SQS message deletion, using an idempotent `jobId` write to avoid duplicate records during queue retries.

## Why The Pipeline Is Asynchronous

Video analysis is not a good fit for synchronous HTTP. Uploads can be large, computer vision is CPU-heavy, and mobile networks are unreliable. A synchronous route would couple client latency, Node worker capacity, object storage transfer, Python processing, and realtime delivery into one fragile request.

The asynchronous pattern gives the system better properties:

- Direct S3 upload keeps large payloads out of the Node API process.
- SQS gives a durable handoff between storage and processing.
- Long polling reduces empty queue churn.
- Visibility timeout semantics let failed jobs reappear for retry.
- Message deletion happens only after processing and source cleanup succeed.
- Python can scale independently from the NestJS API.
- Redis Pub/Sub decouples the CV worker from the WebSocket server.
- Socket.IO gives the user realtime feedback without polling.

## S3 To SQS Bridge

`scripts/localstack/init-aws.sh` creates the local video bucket and analysis queue, then configures bucket notifications for `s3:ObjectCreated:*`.

That makes local development exercise the same event shape as production-style AWS:

```text
S3 ObjectCreated event -> SQS message -> Python worker
```

The worker parses S3 records from the SQS message body, derives fallback metadata from the object key, and reads authoritative job/request metadata from S3 object metadata.

## Worker Processing

`pythonService/main.py` is the SQS worker entrypoint. It:

- validates Redis connectivity on startup
- installs shutdown handlers for `SIGTERM` and `SIGINT`
- long-polls SQS with `WaitTimeSeconds=20`
- processes one message at a time
- extracts S3 records from the SQS event
- downloads the source video
- runs exercise analysis through `process_video`
- publishes the final result to Redis channel `video-analysis:results`
- deletes the source video from S3
- deletes the SQS message after successful processing

The delete order is intentional. If the worker cannot finish the job or cannot delete the source object, it raises an error before deleting the SQS message. That keeps the queue as the retry authority.

## Database Boundary

The requested production-grade shape for this type of system is often described as `S3 -> SQS -> Worker -> DB`, with realtime notification as a final fanout step. In this repository, the durable database write is not yet implemented for video-analysis results. The code currently uses:

- Postgres for user identity, verification, token versioning, and RLS context before generating the upload URL.
- S3 metadata for async job correlation.
- SQS for durable work dispatch.
- Redis Pub/Sub for delivery from Python to Nest.
- Socket.IO for user-facing result notification.

For a future persisted-results feature, the recommended design is an idempotent `video_analysis_jobs` table keyed by `job_id`, with states such as `queued`, `processing`, `completed`, and `failed`. The worker would upsert by `job_id`, commit the result, publish the realtime event, and only then delete the SQS message. That would preserve retry safety under SQS visibility timeout redelivery.

## Result Contract

The worker publishes payloads compatible with `AnalyzeVideoResultPayload<SquatRepetition>`:

```json
{
  "jobId": "string",
  "userId": "uuid",
  "exercise": "squat",
  "requestId": "string",
  "status": "completed",
  "result": {},
  "error": null
}
```

Failed analysis returns the same envelope with `status=failed`, `result=null`, and an `error` string. Keeping success and failure in one envelope simplifies realtime client handling.

## Trace Propagation

The API copies `sentry-trace` and `baggage` headers into S3 object metadata. The Python worker reads those values and calls Sentry trace continuation around SQS processing.

That is a small but important architectural detail: the async boundary does not destroy observability. A single user action can be followed across HTTP, S3 metadata, SQS worker execution, storage download, CV processing, Redis publication, and WebSocket delivery.

## Reliability Notes

- SQS message deletion is explicit and happens after processing.
- Invalid non-S3 messages are deleted to avoid poison-message loops.
- Source objects are deleted after analysis to control storage cost and privacy exposure.
- Worker exceptions are captured in Sentry and the poll loop continues.
- Redis publication returns subscriber count for operational visibility.
