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

/** Analysis values calculated for one detected squat repetition. */
export interface SquatRepetition {
  depth: { value: number; status: string; confidence: number };
  backLean: { value: number; excessive: boolean; confidence: number };
  audit: {
    framesAnalyzed: number;
    validFrames: number;
    cameraAngle: string;
    rawBottomAngle: number;
    samplingRate: string;
  };
}

/** Result event emitted by the video-analysis worker. */
export type VideoAnalysisResult = {
  jobId: string;
  userId: string;
  exercise: string;
  requestId?: string | undefined;
} & ({ status: 'completed'; result: SquatRepetition[]; error: null } | { status: 'failed'; result: null; error: string });
