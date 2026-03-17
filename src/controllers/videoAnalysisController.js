import { enqueueAnalyzeVideo } from "../queues/analyzeVideo/analyzeVideoProducer.js";

// @desc    Get presigned URL from AWS S3
// @route   GET /api/videoanalysis/getpresignedurl
// @access  Private
export const getPresignedUrlFromS3 = async (req, res) => {
  const userId = req.user?.id;
  const presigned = "presigned";

  return res.status(200).json({ presigned });
};

// @desc    Publish job to redis queue
// @route   POST /api/videoanalysis/publishjob
// @access  Private
export const publishVideoAnalysisJob = async (req, res) => {
  const userId = req.user.id;
  const { fileKey, exercise } = req.body;

  const jobId = await enqueueAnalyzeVideo(fileKey, exercise, userId);
  return res.status(200).json({ jobId });
};
