import Bull, { Queue } from 'bull';
import { AnalyzeVideoPayload } from '../../types/dto/videoAnalysis.dto.ts';

declare global {
  var analyzeVideoQueue: Queue<AnalyzeVideoPayload> | undefined;
}

let analyzeVideoQueue = globalThis.analyzeVideoQueue || null;

let prefix;
switch (process.env.NODE_ENV) {
  case 'development':
    prefix = 'dev';
    break;
  case 'production':
    prefix = 'prod';
    break;
  case 'test':
    prefix = 'test';
    break;
  default:
    prefix = 'unknown';
}

if (!analyzeVideoQueue) {
  analyzeVideoQueue = new Bull<AnalyzeVideoPayload>(`${prefix}:analyzeVideoQueue`, process.env.REDIS_URL || '');
  globalThis.analyzeVideoQueue = analyzeVideoQueue;
}

export default analyzeVideoQueue as Queue<AnalyzeVideoPayload>;
