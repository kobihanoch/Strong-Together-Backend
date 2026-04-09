import { RequestHandler } from 'express';
import createError from 'http-errors';

type Role = 'user' | 'admin';

export const authorize =
  (...allowedRoles: Role[]): RequestHandler =>
  (req, _res, next) => {
    const userRole = req.user?.role?.toLowerCase();

    if (!userRole) {
      return next(createError(401, 'Unauthenticated'));
    }

    if (!allowedRoles.includes(userRole as Role)) {
      return next(createError(403, 'Unauthorized'));
    }

    return next();
  };
