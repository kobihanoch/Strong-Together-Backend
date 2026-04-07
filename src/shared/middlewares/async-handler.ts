import { NextFunction, Request, Response } from "express";

export const asyncHandler = <ReqParams, ResBody, ReqBody, ReqQuery>(
  fn: (
    req: Request<ReqParams, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => Promise<void | Response<ResBody>>,
): ((
  req: Request<ReqParams, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
) => void) => {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};
