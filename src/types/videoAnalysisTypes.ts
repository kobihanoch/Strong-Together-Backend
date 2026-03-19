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
