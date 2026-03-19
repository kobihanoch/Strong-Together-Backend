import { Response } from "express";
import { getUploadUrl } from "../aws/s3/s3Utils.ts";
import { enqueueAnalyzeVideo } from "../queues/analyzeVideo/analyzeVideoProducer.js";
import { AuthenticatedRequest } from "../types/sharedTypes.ts";
import {
  GetPresignedUrlFromS3Body,
  GetPresignedUrlFromS3Response,
  PublishVideoAnalysisJobBody,
  PublishVideoAnalysisJobResponse,
} from "../types/videoAnalysisTypes.ts";

// @desc    Get presigned URL from AWS S3
// @route   GET /api/videoanalysis/getpresignedurl
// @access  Private
export const getPresignedUrlFromS3 = async (
  req: AuthenticatedRequest<GetPresignedUrlFromS3Body>,
  res: Response<GetPresignedUrlFromS3Response>,
): Promise<void | Response> => {
  const { fileName, fileType } = req.body;
  const userId = req.user?.id;
  const fileKey = `${userId}/${Date.now()}-${fileName}`;

  const uploadUrl = await getUploadUrl(fileKey, fileType);

  return res.status(200).json({
    uploadUrl,
    fileKey,
  });
};

// @desc    Publish job to redis queue
// @route   POST /api/videoanalysis/publishjob
// @access  Private
export const publishVideoAnalysisJob = async (
  req: AuthenticatedRequest<PublishVideoAnalysisJobBody>,
  res: Response<PublishVideoAnalysisJobResponse>,
): Promise<void | Response> => {
  const userId = req.user.id;
  const { fileKey, exercise } = req.body;

  const jobId = await enqueueAnalyzeVideo({ fileKey, exercise, userId });
  return res.status(200).json({ jobId });
};
