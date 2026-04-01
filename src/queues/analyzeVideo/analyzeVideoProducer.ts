import { randomUUID } from 'node:crypto';
import * as Sentry from '@sentry/node';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { EnqueueAanalyzeVideoParams } from '../../types/dto/videoAnalysis.dto.ts';
import { createLogger } from '../../config/logger.ts';

const logger = createLogger('queue:analyze-video-producer', {
  queue: 'analysisSqsQueue',
});

let sqsClient: SQSClient | null = null;

const getSqsClient = (): SQSClient => {
  if (!sqsClient) {
    sqsClient = new SQSClient({
      region: process.env.AWS_REGION || '',
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    });
  }

  return sqsClient;
};

const resolveQueueUrl = (): string | null => process.env.ANALYSIS_SQS_QUEUE_URL || null;

export const enqueueAnalyzeVideo = async ({
  fileKey,
  exercise,
  userId,
  requestId,
}: EnqueueAanalyzeVideoParams): Promise<string> => {
  const traceData = Sentry.getTraceData();
  const resolvedSentryTrace = traceData['sentry-trace'];
  const resolvedBaggage = traceData.baggage;
  const jobId = randomUUID();
  const queueUrl = resolveQueueUrl();

  if (!queueUrl) {
    if (process.env.NODE_ENV === 'test') {
      logger.info(
        {
          event: 'queue.job_enqueued_test_stub',
          jobId,
          userId,
          exercise,
          fileKey,
          requestId,
        },
        'Analyze video job stubbed because ANALYSIS_SQS_QUEUE_URL is not configured in test',
      );
      return jobId;
    }

    throw new Error('ANALYSIS_SQS_QUEUE_URL is not configured');
  }

  try {
    await getSqsClient().send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          jobId,
          fileKey,
          exercise,
          userId,
          expiresAt: Date.now() + 1000 * 60 * 60 * 12,
          requestId,
          ...(resolvedSentryTrace ? { sentryTrace: resolvedSentryTrace } : {}),
          ...(resolvedBaggage ? { baggage: resolvedBaggage } : {}),
        }),
      }),
    );
    logger.info(
      {
        event: 'queue.job_enqueued',
        jobId,
        userId,
        exercise,
        fileKey,
        requestId,
        hasSentryTrace: Boolean(resolvedSentryTrace),
      },
      'Analyze video job enqueued',
    );
    return jobId;
  } catch (e) {
    if (e instanceof Error)
      logger.error(
        {
          err: e,
          event: 'queue.enqueue_failed',
          userId,
          exercise,
          fileKey,
          requestId,
          hasSentryTrace: Boolean(resolvedSentryTrace),
        },
        'Failed to enqueue analyze video job',
      );
    throw e;
  }
};
