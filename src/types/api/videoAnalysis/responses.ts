export type PublishVideoAnalysisJobResponse = {
  jobId: string;
};

export type GetPresignedUrlFromS3Response = {
  uploadUrl: string;
  fileKey: string;
};
