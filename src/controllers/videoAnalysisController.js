import { enqueueAnalyzeVideo } from "../queues/analyzeVideo/analyzeVideoProducer";

// @desc    Get presigned URL from AWS S3
// @route   GET /api/videoanalysis/getpresignedurl
// @access  Private
export const getPresignedUrlFromS3 = async (req, res) => {
  const userId = req.userId;
  const presigned = "presigned";

  return res.status(200).json({ presigned });
};

// @desc    Publish job to redis queue
// @route   POST /api/videoanalysis/publishjob
// @access  Private
export const publishVideoAnalysisJob = async (req, res) => {
  const jobId = await enqueueAnalyzeVideo(req.fileKey, req.exercise);
  return res.status(200).json({ jobId });
};
