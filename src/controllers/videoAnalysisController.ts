import { Request, Response } from 'express';
import { getUploadUrl } from '../aws/s3/s3Utils.ts';
import { createLogger } from '../config/logger.ts';

import { GetPresignedUrlFromS3Body } from '../types/api/videoAnalysis/requests.ts';
import { GetPresignedUrlFromS3Response } from '../types/api/videoAnalysis/responses.ts';

const logger = createLogger('controller:video-analysis');

// @desc    Get presigned URL from AWS S3
// @route   POST /api/videoanalysis/getpresignedurl
// @access  Private
export const getPresignedUrlFromS3 = async (
  req: Request<{}, GetPresignedUrlFromS3Response, GetPresignedUrlFromS3Body>,
  res: Response<GetPresignedUrlFromS3Response>,
): Promise<Response<GetPresignedUrlFromS3Response>> => {
  const { fileName, fileType } = req.body;
  const userId = req.user!.id;
  const fileKey = `${userId}/${Date.now()}-${fileName}`;
  const requestLogger = req.logger || logger;

  const uploadUrl = await getUploadUrl(fileKey, fileType);
  requestLogger.info(
    { event: 'video_analysis.upload_url_generated', fileKey, fileType },
    'Generated presigned upload URL for video analysis',
  );

  return res.status(200).json({
    uploadUrl,
    fileKey,
  });
};
