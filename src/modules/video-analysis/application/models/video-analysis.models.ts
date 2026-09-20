import type { AnalyzeVideoResultPayloadDto, SquatRepetitionDto } from '@strong-together/shared';

/** Input required to create a direct video upload URL. */
export interface CreateVideoUploadInput {
  exercise: string;
  fileType: string;
  jobId: string;
  userId: string;
  requestId?: string;
  sentryTrace: string;
  baggage: string;
}

/** Upload URL and object key created for a video-analysis job. */
export interface VideoUploadResult {
  payload: { uploadUrl: string; fileKey: string; requestId: string };
  fileKey: string;
}

/** Result event emitted by the video-analysis worker. */
export type VideoAnalysisResult = AnalyzeVideoResultPayloadDto<SquatRepetitionDto>;
