import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutBucketNotificationConfigurationCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  CreateQueueCommand,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import Bull, { Queue } from 'bull';
import { createClient } from 'redis';
import { redisConfig } from '../../../config/redis.config';
import { emailConfig } from '../../../config/email.config';
import { awsConfig } from '../../../config/storage.config';
import { MailerService } from '../../../infrastructure/mailer/mailer.service';

const emailQueue = new Bull('test:emailsQueue', redisConfig.url);
const pushQueue = new Bull('test:pushNotificationsQueue', redisConfig.url);
const redisClient = createClient({ url: redisConfig.url });

const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
  ...(awsConfig.s3Endpoint
    ? {
        endpoint: awsConfig.s3Endpoint,
        forcePathStyle: true,
      }
    : {}),
});
const sqsClient = new SQSClient({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
  ...(process.env.AWS_SQS_ENDPOINT_URL
    ? {
        endpoint: process.env.AWS_SQS_ENDPOINT_URL,
      }
    : {}),
});

function totalQueuedJobs(counts: Awaited<ReturnType<Queue['getJobCounts']>>) {
  return counts.waiting + counts.active + counts.delayed + counts.completed + counts.failed;
}

async function connectedRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}

export async function getRedisKey(key: string) {
  return (await connectedRedis()).get(key);
}

export async function deleteRedisKeysByPattern(pattern: string) {
  const client = await connectedRedis();
  const keys: string[] = [];

  for await (const chunk of client.scanIterator({ MATCH: pattern, COUNT: 1000 })) {
    keys.push(...(Array.isArray(chunk) ? chunk : [chunk]).map(String));
  }

  if (keys.length > 0) {
    await client.del(keys);
  }
}

export async function clearEmailQueue() {
  await emailQueue.obliterate({ force: true });
}

export async function clearMaildevMessages() {
  await fetch(`${emailConfig.maildevApiUrl}/email/all`, { method: 'DELETE' }).catch(() => undefined);
}

export async function clearPushQueue() {
  await pushQueue.obliterate({ force: true });
}

export async function getEmailQueueJobCount() {
  return totalQueuedJobs(await emailQueue.getJobCounts());
}

export async function getPushQueueJobCount() {
  return totalQueuedJobs(await pushQueue.getJobCounts());
}

export async function getLatestEmailJob() {
  const [job] = await emailQueue.getJobs(['waiting', 'delayed', 'active', 'completed'], 0, 0, true);
  return job ?? null;
}

export async function deliverLatestEmailJobToMaildev() {
  const job = await getLatestEmailJob();
  if (!job) return null;

  const mailer = new MailerService(null);
  await mailer.sendMail({
    to: job.data.to,
    subject: job.data.subject,
    html: job.data.html,
  });

  return job;
}

export async function getMaildevMessages() {
  const response = await fetch(`${emailConfig.maildevApiUrl}/email`);
  if (!response.ok) return [];

  return (await response.json()) as Array<{
    id: string;
    subject: string;
    html?: string;
    text?: string;
    to?: Array<{ address?: string; name?: string }> | string;
  }>;
}

export async function waitForMaildevMessage(subject: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const messages = await getMaildevMessages();
    const message = messages.find((item) => item.subject === subject || item.subject?.includes(subject));
    if (message) return message;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return null;
}

export async function getLatestPushJob() {
  const [job] = await pushQueue.getJobs(['waiting', 'delayed', 'active', 'completed'], 0, 0, true);
  return job ?? null;
}

export async function headUploadedObject(key: string, bucket = awsConfig.bucketName) {
  return s3Client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function ensureS3Bucket(bucket: string) {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
  } catch (e: any) {
    if (e?.name === 'BucketAlreadyOwnedByYou' || e?.name === 'BucketAlreadyExists' || e?.$metadata?.httpStatusCode === 409) {
      return;
    }
    throw e;
  }
}

export async function deleteUploadedObject(key: string, bucket = awsConfig.bucketName) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function purgeAnalysisQueue() {
  if (!process.env.AWS_ANALYSIS_SQS_QUEUE_URL) return;

  try {
    await sqsClient.send(
      new PurgeQueueCommand({
        QueueUrl: process.env.AWS_ANALYSIS_SQS_QUEUE_URL,
      }),
    );
  } catch {
    // SQS purge has a short cooldown; tests can continue with receive/delete.
  }
}

export async function ensureAnalysisQueue(bucket = awsConfig.bucketName) {
  const queueUrl = process.env.AWS_ANALYSIS_SQS_QUEUE_URL;
  if (!queueUrl || !bucket) return;

  const queueName = queueUrl.split('/').filter(Boolean).at(-1);
  if (!queueName) return;

  await sqsClient.send(new CreateQueueCommand({ QueueName: queueName }));
  const attributes = await sqsClient.send(
    new GetQueueAttributesCommand({
      QueueUrl: queueUrl,
      AttributeNames: ['QueueArn'],
    }),
  );
  const queueArn = attributes.Attributes?.QueueArn;
  if (!queueArn) return;

  await s3Client.send(
    new PutBucketNotificationConfigurationCommand({
      Bucket: bucket,
      NotificationConfiguration: {
        QueueConfigurations: [
          {
            QueueArn: queueArn,
            Events: ['s3:ObjectCreated:*'],
          },
        ],
      },
    }),
  );
}

export async function receiveAnalysisQueueMessage() {
  if (!process.env.AWS_ANALYSIS_SQS_QUEUE_URL) return null;

  const result = await sqsClient.send(
    new ReceiveMessageCommand({
      QueueUrl: process.env.AWS_ANALYSIS_SQS_QUEUE_URL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 2,
    }),
  );
  const message = result.Messages?.[0] ?? null;

  if (message?.ReceiptHandle) {
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: process.env.AWS_ANALYSIS_SQS_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      }),
    );
  }

  return message;
}

export async function closeInfraClients() {
  await Promise.all([emailQueue.close(), pushQueue.close(), redisClient.isOpen ? redisClient.quit() : undefined]);
  sqsClient.destroy();
  s3Client.destroy();
}
