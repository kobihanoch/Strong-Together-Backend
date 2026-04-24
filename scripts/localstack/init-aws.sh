#!/bin/sh
set -e

# Global vars
VIDEO_PROCESSING_BUCKET_NAME="${AWS_BUCKET_NAME}"
PROFILE_BUCKET_NAME="profile-pics"
QUEUE_NAME="s3-upload-processing-queue"

# Create buckets and SQS queue
# 2>&1 => 1 is output, 2 is error => Redirect the output of errors as output
awslocal s3api create-bucket --bucket "$VIDEO_PROCESSING_BUCKET_NAME" >/dev/null 2>&1 || true
awslocal s3api create-bucket --bucket "$PROFILE_BUCKET_NAME" >/dev/null 2>&1 || true
awslocal sqs create-queue --queue-name "$QUEUE_NAME" >/dev/null

# SQS queue URL and ARN (for S3 event notifications)
QUEUE_URL="$(awslocal sqs get-queue-url --queue-name "$QUEUE_NAME" --output text --query QueueUrl)"
QUEUE_ARN="$(awslocal sqs get-queue-attributes --queue-url "$QUEUE_URL" --attribute-names QueueArn --output text --query Attributes.QueueArn)"

# Create S3 event notification policy
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

# Attach S3 event notification policy to video analysis S3 bucket
awslocal s3api put-bucket-notification-configuration \
  --bucket "$VIDEO_PROCESSING_BUCKET_NAME" \
  --notification-configuration file:///tmp/s3-event-notification.json
