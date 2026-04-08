import { RequestHandler } from 'express';

export const asyncHandler = <P, Res, Req, Q>(fn: RequestHandler<P, Res, Req, Q>): RequestHandler<P, Res, Req, Q> => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
