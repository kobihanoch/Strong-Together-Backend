import { NextFunction, Request, Response } from 'express';

export const authorizeRoles = (
  ...roles: string[]
): ((req: Request, res: Response, next: NextFunction) => void | Response<{ message: string }>) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(401).json({ message: 'Access forbidden: Insufficient role' });
    }
    return next();
  };
};
