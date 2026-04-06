import { ErrorRequestHandler, Response } from 'express';
import { createLogger } from '../config/logger.ts';

const logger = createLogger('middleware:error-handler');

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
): Response<{ success: boolean; message: string }> => {
  // Log to dev console error stack
  // Log to prod console error message
  const statusCode = err.statusCode || 500;
  const requestLogger = req.logger || logger;

  // Log
  requestLogger.error(
    {
      err,
      event: 'request.failed',
      statusCode,
      method: req.method,
      path: req.originalUrl,
      userId: req.user?.id,
    },
    err.message || 'Unhandled request error',
  );

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
