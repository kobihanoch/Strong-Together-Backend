import { HeadObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import Bull, { Queue } from 'bull';
import { redisConfig } from '../../../config/redis.config';
import { awsConfig } from '../../../config/storage.config';

const emailQueue = new Bull('test:emailsQueue', redisConfig.url);
const pushQueue = new Bull('test:pushNotificationsQueue', redisConfig.url);

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

function totalQueuedJobs(counts: Awaited<ReturnType<Queue['getJobCounts']>>) {
  return counts.waiting + counts.active + counts.delayed + counts.completed + counts.failed;
}

export async function clearEmailQueue() {
  await emailQueue.obliterate({ force: true });
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

export async function getLatestPushJob() {
  const [job] = await pushQueue.getJobs(['waiting', 'delayed', 'active', 'completed'], 0, 0, true);
  return job ?? null;
}

export async function headUploadedObject(key: string) {
  return s3Client.send(
    new HeadObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
    }),
  );
}

export async function deleteUploadedObject(key: string) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
    }),
  );
}

export async function closeInfraClients() {
  await Promise.all([emailQueue.close(), pushQueue.close()]);
  s3Client.destroy();
}
