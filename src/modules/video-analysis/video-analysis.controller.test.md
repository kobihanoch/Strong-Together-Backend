# Video Analysis Controller Test Checks

## Happy Paths

### `POST /api/videoanalysis/getpresignedurl`

- [x] Returns a schema-valid presigned upload response.
- [x] Uploads the test file to LocalStack S3.
- [x] Confirms the S3 object metadata.
- [x] Confirms S3 emits an SQS event.

## Bad Paths

### `POST /api/videoanalysis/getpresignedurl`

- [x] Rejects bad payloads with `400`.
- [x] Rejects missing auth with `401`.

## Edge Cases

### S3 metadata

- [x] Stores tracing metadata.
- [x] Stores job metadata.

### Queue integration

- [x] Verifies the upload path triggers S3-to-SQS delivery.
