import { Request, Response } from "express";
import { getUploadUrl } from "../aws/s3/s3Utils.ts";
import { enqueueAnalyzeVideo } from "../queues/analyzeVideo/analyzeVideoProducer.js";

import {
  GetPresignedUrlFromS3Body,
  PublishVideoAnalysisJobBody,
} from "../types/api/videoAnalysis/requests.ts";
import {
  GetPresignedUrlFromS3Response,
  PublishVideoAnalysisJobResponse,
} from "../types/api/videoAnalysis/responses.ts";

// @desc    Get presigned URL from AWS S3
// @route   GET /api/videoanalysis/getpresignedurl
// @access  Private
export const getPresignedUrlFromS3 = async (
  req: Request<{}, GetPresignedUrlFromS3Response, GetPresignedUrlFromS3Body>,
  res: Response<GetPresignedUrlFromS3Response>,
): Promise<Response<GetPresignedUrlFromS3Response>> => {
  const { fileName, fileType } = req.body;
  const userId = req.user!.id;
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
  req: Request<
    {},
    PublishVideoAnalysisJobResponse,
    PublishVideoAnalysisJobBody
  >,
  res: Response<PublishVideoAnalysisJobResponse>,
): Promise<Response<PublishVideoAnalysisJobResponse>> => {
  const userId = req.user!.id;
  const { fileKey, exercise } = req.body;

  const jobId = await enqueueAnalyzeVideo({ fileKey, exercise, userId });
  return res.status(200).json({ jobId });
};
