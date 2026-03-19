export type PublishVideoAnalysisJobBody = {
  fileKey: string;
  exercise: string;
};

export type PublishVideoAnalysisJobResponse = {
  jobId: string;
};

export type GetPresignedUrlFromS3Body = {
  fileName: string;
  fileType: string;
};

export type GetPresignedUrlFromS3Response = {
  uploadUrl: string;
  fileKey: string;
};

export type EnqueueAanalyzeVideoParams = {
  fileKey: string;
  exercise: string;
  userId: string;
};

export type AnalyzeVideoPayload = {
  fileKey: string;
  exercise: string;
  userId: string;
  expiresAt: number;
};

export interface SquatRepetition {
  depth: {
    value: number;
    status: string;
    confidence: number;
  };
  back_lean: {
    value: number;
    excessive: boolean;
    confidence: number;
  };
  audit: {
    frames_analyzed: number;
    valid_frames: number;
    camera_angle: "SIDE_VIEW" | "FRONT_VIEW" | string;
    raw_bottom_angle: number;
    sampling_rate: string;
  };
}

export type AnalyzeVideoResultPayload<T> = {
  jobId: string;
  userId: string;
  exercise: string;
} & (
  | {
      status: "completed";
      result: T[];
      error: null;
    }
  | {
      status: "failed";
      result: null;
      error: string;
    }
);
