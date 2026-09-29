import { describe, expect, it } from 'vitest';
import { VideoAnalysisResultEvent } from './video-analysis-result-event';
import { VideoUploadRequest } from './video-upload-request';

const upload = {
  exercise: 'barbell_squat',
  fileType: 'video/mp4',
  jobId: 'job-1',
  userId: 'user-1',
  sentryTrace: '',
  baggage: '',
};

describe('VideoUploadRequest', () => {
  it('normalizes input and creates the existing object-key format', () => {
    const request = VideoUploadRequest.create(upload);
    expect(request.exercise.value).toBe('barbell_squat');
    expect(request.fileType.value).toBe('video/mp4');
    expect(request.fileKey(123)).toBe('barbell_squat_user-1_123');
  });

  it('enforces exercise, file type, and job identity rules', () => {
    expect(() => VideoUploadRequest.create({ ...upload, exercise: 'invalid exercise' })).toThrow('Invalid exercise name');
    expect(() => VideoUploadRequest.create({ ...upload, fileType: 'image/png' })).toThrow('Unsupported video file type');
    expect(() => VideoUploadRequest.create({ ...upload, jobId: ' ' })).toThrow('Invalid video-analysis job ID');
  });
});

describe('VideoAnalysisResultEvent', () => {
  it('preserves completed and failed result variants', () => {
    const completed = VideoAnalysisResultEvent.create({
      jobId: 'job-1', userId: 'user-1', exercise: 'squat', status: 'completed', result: [], error: null,
    });
    const failed = VideoAnalysisResultEvent.create({
      jobId: 'job-1', userId: 'user-1', exercise: 'squat', status: 'failed', result: null, error: 'failed',
    });
    expect(completed.payload.status).toBe('completed');
    expect(failed.payload.status).toBe('failed');
  });
});
