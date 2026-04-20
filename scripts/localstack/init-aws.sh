#!/bin/sh
set -e

BUCKET_NAME="${AWS_BUCKET_NAME:-strong-together-videos-dev}"
QUEUE_NAME="${AWS_ANALYSIS_QUEUE_NAME:-s3-upload-processing-queue}"

awslocal s3api create-bucket --bucket "$BUCKET_NAME" >/dev/null 2>&1 || true
awslocal sqs create-queue --queue-name "$QUEUE_NAME" >/dev/null

QUEUE_URL="$(awslocal sqs get-queue-url --queue-name "$QUEUE_NAME" --output text --query QueueUrl)"
QUEUE_ARN="$(awslocal sqs get-queue-attributes --queue-url "$QUEUE_URL" --attribute-names QueueArn --output text --query Attributes.QueueArn)"

cat <<EOF >/tmp/s3-event-notification.json
{
  "QueueConfigurations": [
    {
      "QueueArn": "$QUEUE_ARN",
      "Events": ["s3:ObjectCreated:*"]
    }
  ]
}
EOF

awslocal s3api put-bucket-notification-configuration \
  --bucket "$BUCKET_NAME" \
  --notification-configuration file:///tmp/s3-event-notification.json
