import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<{ success: boolean; message: string }> => {
  // Log to dev console error stack
  // Log to prod console error message
  const statusCode = err.statusCode || 500;

  const logMessage = process.env.NODE_ENV === 'development' ? err.stack : err.message;

  console.error(`[Error ${statusCode}]: ${logMessage}`);

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
