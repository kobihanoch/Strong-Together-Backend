export type PublishVideoAnalysisJobBody = {
  fileKey: string;
  exercise: string;
};

export type GetPresignedUrlFromS3Body = {
  fileName: string;
  fileType: string;
};
